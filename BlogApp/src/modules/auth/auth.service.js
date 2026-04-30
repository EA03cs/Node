import connection from "../../DB/connection.db.js";
import { asyncHandler, HttpError } from "../../utils/http.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";

const publicUserFields = 'u_id, u_firstname, u_middlename, u_lastname, u_email, u_dob';


export const signup = asyncHandler(async (req, res) => {
    const { firstName, middleName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        throw new HttpError(400, 'Passwords do not match');
    }

    if (!firstName || !lastName || !email || !password) {
        throw new HttpError(400, 'All fields are required');
    }

    const findQuery = 'SELECT * FROM users WHERE u_email = ?';
    const [existingUsers] = await connection.execute(findQuery, [email]);

    if (existingUsers.length > 0) {
        throw new HttpError(409, 'User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const insertQuery = 'INSERT INTO users (u_firstname, u_middlename, u_lastname, u_email, u_password) VALUES (?, ?, ?, ?, ?)';
    const [data] = await connection.execute(insertQuery, [firstName, middleName || null, lastName, email, hashedPassword]);

    res.status(201).json({ message: "User created successfully", data: { id: data.insertId } });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new HttpError(400, 'Email and password are required');
    }

    const findQuery = `SELECT ${publicUserFields}, u_password FROM users WHERE u_email = ?`;
    const [data] = await connection.execute(findQuery, [email]);

    if (data.length === 0 || !(await verifyPassword(password, data[0].u_password))) {
        throw new HttpError(401, 'Invalid email or password');
    }

    const { u_password, ...user } = data[0];
    res.status(200).json({ message: "Login successful", data: user });
});
