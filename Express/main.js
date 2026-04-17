const express = require('express');
const app = express();
const port = 3000;

let isLoggedIn = false;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const authMiddleware = (req, res, next) => {
    if (isLoggedIn) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};
app.use(authMiddleware);

app.get('/dashboard', (req, res, next) => {
    res.send('Welcome to the dashboard!');
});

app.get('/login', (req, res, next) => {
    res.send('Login successful!');
});