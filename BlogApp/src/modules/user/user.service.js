import connection from "../../DB/connection.db.js";
import { asyncHandler, HttpError } from "../../utils/http.js";

const publicUserFields = `
    u_id,
    u_firstname,
    u_middlename,
    u_lastname,
    u_email,
    CONVERT(u_dob, CHAR) AS u_dob
`;

export const getAllUsers = asyncHandler(async (req, res) => {
    const sql = `SELECT ${publicUserFields} FROM users`;
    const [data] = await connection.execute(sql);

    res.json({ message: "success", data });
});

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT
            CONCAT_WS(" ", u_firstname, u_middlename, u_lastname) AS fullName,
            u_email,
            u_id,
            CONVERT(u_dob, CHAR) AS u_dob
        FROM users
        WHERE u_id = ?
    `;
    const [data] = await connection.execute(sql, [id]);

    if (data.length === 0) {
        throw new HttpError(404, 'User not found');
    }

    res.json({ message: "success", data: data[0] });
});

export const searchUser = asyncHandler(async (req, res) => {
    const { searchKey } = req.query;

    if (!searchKey) {
        throw new HttpError(400, 'searchKey is required');
    }

    const sql = `SELECT ${publicUserFields} FROM users WHERE u_firstname LIKE ?`;
    const [data] = await connection.execute(sql, [`%${searchKey}%`]);

    if (data.length === 0) {
        throw new HttpError(404, 'User not found');
    }

    res.json({ message: "success", data });
});

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstName, middleName, lastName, DOB } = req.body;

    if (!firstName || !lastName || !DOB) {
        throw new HttpError(400, 'firstName, lastName, and DOB are required');
    }

    const sql = 'UPDATE users SET u_firstname = ?, u_middlename = ?, u_lastname = ?, u_DOB = ? WHERE u_id = ?';
    const [data] = await connection.execute(sql, [firstName, middleName || null, lastName, DOB, id]);

    if (data.affectedRows === 0) {
        throw new HttpError(404, 'Invalid account Id');
    }

    return res.json({ message: "Done", affectedRows: data.affectedRows });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE u_id = ?';
    const [data] = await connection.execute(sql, [id]);

    if (data.affectedRows === 0) {
        throw new HttpError(404, 'Invalid account Id');
    }

    return res.json({ message: "Done", affectedRows: data.affectedRows });
});
