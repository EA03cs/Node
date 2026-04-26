import { stablishDBConnection } from './DB/connection.db.js';
import authcontroller from './modules/auth/auth.controller.js';
import userController from './modules/user/user.controller.js';
import blogcontroller from './modules/blogs/blog.controller.js';
import express from 'express';
const bootstrap = () => {
    const app = express();
    const port = 3000;


    stablishDBConnection();
    app.use(express.json());
    app.get('/'), (req, res, next) => { res.send('Hello World!'); }

    app.use("/auth", authcontroller);
    app.use("/user", userController);
    app.use("/blog", blogcontroller);

    return app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
export default bootstrap;