import e from "express";
import UserModel from "../../db/model/UserModel.js";
import { asyncHandler } from "../../utils/response.js";
import * as dbService from "../../db/service/db.service.js";
import {successResponse,globalErrorHandler} from "../../utils/response.js";
import bcrypt from "bcryptjs";
import * as hashSecurity from "../../utils/security/hash.security.js";
import { generateToken } from "../../utils/security/token.js";
export const signup = asyncHandler(async (req, res, next) => {
    const { fullName, email, password, phone } = req.body;
    console.log(req.body);

    const checkUser = await dbService.findone({
        model: UserModel, filter: { email },
    });
    if (checkUser) {
        return globalErrorHandler(res, 400, false, 'Email already exists', null);
    }

    const hashedPassword = await hashSecurity.generatehashPassword({ plainText: password, salt: 12 });
    const user = await dbService.create({
        model: UserModel,
        data: { fullName, email, password: hashedPassword, phone },
    });
    return successResponse(res, 201, true, 'User created successfully', user);
 },);
export const login =  asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await dbService.findone({
             model: UserModel, filter: { email }
        });
            if(!user) {
                return globalErrorHandler(res, 404, false, 'Invalid email or password', null);
            }
            const isPasswordValid = await hashSecurity.comparePassword({ plainText: password, hashValue: user.password });
            if(!isPasswordValid) {
                return globalErrorHandler(res, 401, false, 'Invalid email or password', null);
            }
            const token = await generateToken({ payload: { userId: user._id, email: user.email } });
            const refreshToken = await generateToken({ payload: { userId: user._id, email: user.email }, options: { expiresIn: 60 * 60 * 24 * 7 } });
            user.refreshToken = refreshToken;
            await user.save();
            return successResponse(res, 200, true, 'User logged in successfully', { user, token, refreshToken });}
);

// {
//     "fullName":"elsayed atef",
//     "email":"elsayedatef469@gmail.com",
//     "password":"01023888997",
//     "phone":"01023888997"
// }