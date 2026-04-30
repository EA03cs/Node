import express from 'express';
import authController from './modules/auth/auth.controller.js';
import userController from './modules/user/user.controller.js';
import connectionDB from './DB/connection.db.js';
const bootstrap = async () => {
    const app = express();
    const port = 3000;

    await connectionDB()
    app.use(express.json());
    app.get('/', (req, res) => { res.json({ message: ' API is running' }); });
    app.use("/auth", authController);
    app.use("/user", userController);

    return app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
export default bootstrap;
