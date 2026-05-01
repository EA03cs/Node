import { comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { HttpError } from '../utils/error.js';
import User from '../models/user.model.js';

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log({email , password});
    

    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError(404, 'User not found');
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
        throw new HttpError(401, 'Invalid credentials');
    }

    const token = generateToken(user);

    return successResponse(res, {
        message: 'Login successful',
        data: {
            user,
            token
        }
    });
});