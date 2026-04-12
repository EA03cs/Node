const fs = require('fs');
const http = require('http');
const path = require('path');
const { json } = require('stream/consumers');
let port = 3000;
function requestListener() {
    server.listen(port, () => {
        console.log('Server running at port 3000');
    }
    );
}

const server = http.createServer((req, res) => {
    const { url, method } = req;
    console.log({ url, method });
    if (req.url === '/findUser' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            body = JSON.parse(body);

            const { name } = body;

            const findUsers = JSON.parse(
                fs.readFileSync(path.resolve('./Https/users.json'), 'utf-8')
            );

            const users = findUsers
                .filter((u) => u.name.toLowerCase().includes(name.toLowerCase()))
                .map((u) => ({
                    name: u.name,
                    email: u.email,
                    id: u.id
                }));
            if (users) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(users));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        });
    } else if (req.url === '/about' && req.method === 'GET') {
        console.log('About page');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('About page');
    } else if (req.url === '/users' && req.method === 'GET') {
        const users = JSON.parse(
            fs.readFileSync(path.resolve('./Https/users.json'), 'utf-8'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(users));
        res.end();
    } else if (req.url === '/signup' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            console.log(chunk);
            body += chunk;
        });
        req.on('end', () => {
            console.log('Received body:', body);
            body = JSON.parse(body);
            console.log({ body });
            const { name, email, password } = body;
            console.log({ name, email, password });
            const users = JSON.parse(fs.readFileSync(path.resolve('./Https/users.json'), 'utf-8'));
            console.log({ users });
            const checkUserExists = users.find((u) => u.email === email);
            if (checkUserExists) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ error: 'User already exists' }));
                res.end();
            } else {
                users.push({ name, email, password, id: Date.now() });
                fs.writeFileSync(path.resolve('./Https/users.json'), JSON.stringify(users), { encoding: 'utf-8' });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: 'User registered successfully' }));
                res.end();
            }
        });
    } else {
        res.writeHead(404);
        res.end('Page not found');
    }
})
requestListener();
