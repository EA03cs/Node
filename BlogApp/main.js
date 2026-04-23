//http://3.76.36.129:3000/
const express = require('express');
const mysql2 = require('mysql2');
const app = express();
const port = 3000;
app.use(express.json());
const connection = mysql2.createConnection({
    port: '3306',
    user: 'root',
    password: '',
    database: 'users'
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});
app.get('/getUsers', (req, res) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ "message": "success", "data": data });
    });
});
app.post("/auth/signup", (req, res) => {
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

});
app.post("/auth/login", (req, res) => {
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
});
app.get('/user/:id/profile', (req, res) => {
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
});
app.get("/user/search", (req, res) => {
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
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 