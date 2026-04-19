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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 