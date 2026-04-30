import { establishDBConnection } from './DB/connection.db.js';
import { config } from './config.js';
import authController from './modules/auth/auth.controller.js';
import userController from './modules/user/user.controller.js';
import blogController from './modules/blogs/blog.controller.js';
import { errorHandler, notFoundHandler } from './utils/http.js';
import express from 'express';
const bootstrap = async () => {
    const app = express();
    const port = config.port;


    await establishDBConnection();
    app.use(express.json());
    app.get('/', (req, res) => { res.json({ message: 'Blog API is running' }); });

    app.use("/auth", authController);
    app.use("/user", userController);
    app.use("/blog", blogController);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
export default bootstrap;
