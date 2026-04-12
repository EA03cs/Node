const http = require('http');
let port = 3000;
let user = [];
function requestListener() {
    server.listen(port, () => {
        console.log('Server running at port 3000');
    }
    );
}
const server = http.createServer((req, res) => {
    const { url, method } = req;
    console.log({ url, method });
    if (req.url === '/profile' && req.method === 'GET') {
        console.log('Profile page');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Welcome to your profile!');
        res.end();
    } else if (req.url === '/about' && req.method === 'GET') {
        console.log('About page');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('About page');
    } else if (req.url === '/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(user));
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
            const checkUserExists = user.find((u) => u.email === email);
            if (checkUserExists) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ error: 'User already exists' }));
                res.end();
            } else {
                user.push({ name, email, password, id: Date.now() });
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
