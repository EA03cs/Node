const express = require('express');
const app = express();
const port = 3000;

// let isLoggedIn = false;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// const authMiddleware = (req, res, next) => {
//     if (isLoggedIn) {
//         next();
//     } else {
//         res.status(401).send('Unauthorized');
//     }
// };
// app.use(authMiddleware);

// app.get('/dashboard', (req, res, next) => {
//     res.send('Welcome to the dashboard!');
// });

// app.get('/login', (req, res, next) => {
//     res.send('Login successful!');
// });
let users = [
    {
        username: 'saaaccyed',
        email: 'elsedt000f0@gmail.com',
        password: 111222,
        id: 1776010406380
    },
    {
        username: 'saaaccyed',
        email: 'elsedf0@gmail.com',
        password: 11122,
        id: 1776010429511
    },
    {
        username: 'ddeyas',
        email: 'elsayedatef@gmail.com',
        password: 11122,
        id: 1776012289200
    }
];
app.use(express.json());
app.post('/signup', (req, res, next) => {
    console.log(req.body);
    const [username, email, password] = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
        res.status(409).send('User already exists');
    } else {
        users.push({ username, email, password, id: Date.now() });
        res.send('Signup successful!', users);
    }
});
app.post('/login', (req, res, next) => {
    console.log(req.body);
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.send('Login successful!', user);
    } else {
        res.status(404).send('User not found');
    }
});
app.get('/profile/:id', (req, res, next) => {
    console.log(req.params);
    const user = users.find(u => u.id === parseInt(req.params.id));
    user ? res.send({ message: 'User found', user }) : res.status(404).send('User not found');
});
app.get('/user/search', (req, res, next) => {
    console.log(req.query);
    const { username } = req.query;
    const user = users.find(u => u.username === username);
    user ? res.send({ message: 'User found', user }) : res.status(404).send('User not found');
});