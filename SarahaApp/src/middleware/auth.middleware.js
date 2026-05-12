import jwt from 'jsonwebtoken';
import * as dbService from "../db/service/db.service.js";
import { globalErrorHandler } from "../utils/response.js";
import { asyncHandler } from "../utils/response.js";
import UserModel from "../db/model/UserModel.js";

export const authMiddleware = () => {
    return asyncHandler(async (req, res, next) => {
            console.log(req.headers);
            const {authorization} = req.headers;
            console.log(authorization);
            const token = authorization.replace("Bearer ", "");
            const decodedToken = jwt.verify(token, "your_secret_key_here");
            if (!decodedToken) {
                return globalErrorHandler(res, 401, false, 'Invalid token', null);
            }
            console.log(decodedToken)
            const user = await dbService.findone({
                model: UserModel, filter: { _id: decodedToken.userId }
            });
            if (!user) {
                return globalErrorHandler(res, 404, false, 'User not found', null);
            }
            req.user = user;
            next();
    });
}