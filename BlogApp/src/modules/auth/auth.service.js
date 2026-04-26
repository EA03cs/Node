import connection from "../../DB/connection.db.js";

export const signup = (req, res, next) => {
    const { firstName, middleName, lastName, email, password, confirmPassword } = req.body;
    console.log(req.body);
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    } if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const findQuery = 'SELECT * FROM users WHERE u_email = ?';
    connection.query(findQuery, [email], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const insertQuery = 'INSERT INTO users (u_firstname, u_middlename, u_lastname, u_email, u_password) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertQuery, [firstName, middleName, lastName, email, password], (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ "message": "User created successfully", "data": data });
        });
    });

};
export const login = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const findQuery = 'SELECT * FROM users WHERE u_email = ? AND u_password = ?';
    connection.query(findQuery, [email, password], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
        if (data.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ "message": "Login successful", "data": data });
    });
};