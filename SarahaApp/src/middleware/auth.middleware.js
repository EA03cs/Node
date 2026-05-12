import jwt from 'jsonwebtoken';
import * as dbService from "../db/service/db.service.js";
import { globalErrorHandler } from "../utils/response.js";
import { asyncHandler } from "../utils/response.js";
import UserModel from "../db/model/UserModel.js";

export const authMiddleware = () => {
    return asyncHandler(async (req, res, next) => {
            const { authorization } = req.headers;
            if (!authorization) {
                return globalErrorHandler(res, 401, false, 'Authorization header missing', null);
            }

            const token = authorization.replace("Bearer ", "").trim();
            const decodedToken = jwt.verify(token, "your_secret_key_here");
            if (!decodedToken) {
                return globalErrorHandler(res, 401, false, 'Invalid token', null);
            }

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