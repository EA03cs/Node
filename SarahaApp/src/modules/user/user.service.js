import UserModel from "../../db/model/UserModel.js";
import { asyncHandler } from "../../utils/response.js";
import * as dbService from "../../db/service/db.service.js";
import {successResponse,globalErrorHandler} from "../../utils/response.js";
import bcrypt from "bcryptjs";
import * as hashSecurity from "../../utils/security/hash.security.js";
import jwt from "jsonwebtoken";
export const getAllUsers = (async (req, res , next) => {
res.status(200).json({ message: "success", data: [] });
});

export const getUserBytoken = (async (req, res , next) => {

    // const user = await dbService.findone({
    //     model: UserModel, filter: { _id: decodedToken.userId }
    // });
        const user = req.user;
    return successResponse(res, 200, true, 'User found successfully', user);
});

export const getUserById = ( (req, res) => {

res.status(200).json({ message: "success", data: null });

});

export const searchUser = ( (req, res) => {
res.status(200).json({ message: "success", data: [] });
});

export const updateUser = ( (req, res) => {
res.status(200).json({ message: "success", data: null });
});

export const deleteUser = ( (req, res) => {
res.status(200).json({ message: "success" });
});
