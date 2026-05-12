import UserModel from "../../db/model/UserModel.js";
import * as dbService from "../../db/service/db.service.js";
import { successResponse, globalErrorHandler } from "../../utils/response.js";

export const getAllUsers = async (req, res, next) => {
    const users = await dbService.find({
        model: UserModel, filter: {}
    });
    return successResponse(res, 200, true, 'Users retrieved successfully', users);
};

export const getUserBytoken = async (req, res, next) => {
    const user = req.user;
    return successResponse(res, 200, true, 'User found successfully', user);
};

export const getUserById = async (req, res) => {
    const user = await dbService.findone({
        model: UserModel, filter: { _id: req.params.id }
    });

    if (!user) {
        return globalErrorHandler(res, 404, false, 'User not found', null);
    }

    return successResponse(res, 200, true, 'User retrieved successfully', user);
};

export const searchUser = async (req, res) => {
    const { name } = req.query;
    const users = await dbService.find({
        model: UserModel, filter: { name: new RegExp(name, 'i') }
    });
    return successResponse(res, 200, true, 'Search completed successfully', users);
};

export const updateUser = async (req, res) => {
    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.params.id,
        data: req.body,
        options: { new: true }
    });

    if (!user) {
        return globalErrorHandler(res, 404, false, 'User not found', null);
    }

    return successResponse(res, 200, true, 'User updated successfully', user);
};

export const deleteUser = async (req, res) => {
    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.params.id,
        data: { isDeleted: true }
    });

    if (!user) {
        return globalErrorHandler(res, 404, false, 'User not found', null);
    }

    return successResponse(res, 200, true, 'User deleted successfully', null);
};
