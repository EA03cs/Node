import e from "express";
import UserModel from "../../db/model/UserModel.js";
import { asyncHandler } from "../../utils/response.js";
import * as dbService from "../../db/service/db.service.js";
import {successResponse,globalErrorHandler} from "../../utils/response.js";

export const signup = asyncHandler(async (req, res, next) => {
    const { fullName, email, password, phone } = req.body;
    console.log(req.body);
    const checkUser = await dbService.findone({ model: UserModel, filter: { email },select: "-password"
 });
    if(checkUser) {
        return globalErrorHandler(res, 400, false, 'Email already exists', null);
    }
    const user =  await UserModel.create({ fullName, email, password, phone });
    return successResponse(res, 201, true, 'User created successfully', user);
 },);

export const login =  asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await dbService.findone({
             model: UserModel, filter: { email, password },
             select: "-password -__v"
        });
            if(!user) {
                return globalErrorHandler(res, 404, false, 'Invalid email or password', null);
            }
            return successResponse(res, 200, true, 'User logged in successfully', user);}
);

// {
//     "fullName":"elsayed atef",
//     "email":"elsayedatef469@gmail.com",
//     "password":"01023888997",
//     "phone":"01023888997"
// }