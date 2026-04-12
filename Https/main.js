const http = require('http');
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
    if (req.url === '/profile' && req.method === 'GET') {
        console.log('Profile page');
        res.end();
    } else if (req.url === '/about' && req.method === 'GET') {
        console.log('About page');
        res.end();
    } else if (req.url === '/contact' && req.method === 'GET') {
        console.log('Contact page');
        res.end();
    } else {
        res.writeHead(404);
        console.log('Page not found');
        res.end();
    }
})
requestListener();
