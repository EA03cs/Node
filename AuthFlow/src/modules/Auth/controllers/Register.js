import { hashPassword } from '../utils/hash.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { HttpError } from '../utils/error.js';
import User from '../models/user.model.js';

export const register = asyncHandler(async (req, res) => {
    const { name, email, password , phone} = req.body;
    console.log(req.body);

    const exists = await User.findOne({ email });

    if (exists) {
        throw new HttpError(400, 'Email already exists');
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
        name,
        email,
        password: hashed,
        phone
    });

    return successResponse(res, {
        message: 'User registered successfully',
        data: user
    });
});