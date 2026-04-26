import connection from "../../DB/connection.db.js";
export const getAllUsers = (req, res, next) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ "message": "success", "data": data });
    });
};

export const getUserById = (req, res, next) => {
    const { id } = req.params;
    const sql = 'SELECT concat(u_firstname, " ", u_middlename, " ", u_lastname) as fullName , u_email, u_id,convert(u_dob, char) as u_dob FROM users WHERE u_id = ?';
    connection.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ "message": "success", "data": data });
    });
};
export const searchUser = (req, res, next) => {
    const { searchKey } = req.query;
    const sql = 'SELECT * FROM users where u_firstName like ?'
    connection.query(sql, ["%" + searchKey + "%"], (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ "message": "success", "data": data });
    })
};
export const updateUser = (req, res, next) => {
    const { id } = req.params;
    const { DOB, firstName } = req.body;
    console.log({ DOB, firstName, id });
    const sql = 'update users set u_DOB=?,u_firstName=? where u_id=?'
    connection.execute(sql, [DOB, firstName, id], (err, data) => {
        if (err) {
            res.status(500).json({ message: "internal server error" })
        }
        return data.affectedRows ? res.json({ message: "Done", data }) : res.status(404).json({ message: "In-valid account Id" })
    })
}
export const deleteUser = (req, res, next) => {
    const { id } = req.params;
    const sql = 'delete from users where u_id=?'
    connection.execute(sql, [id], (err, data) => {
        if (err) {
            res.status(500).json({ message: "internal server error" })
        }
        return data.affectedRows ? res.json({ message: "Done", data }) : res.status(404).json({ message: "In-valid account Id" })
    })
}