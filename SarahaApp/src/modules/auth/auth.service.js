import e from "express";
import UserModel from "../../db/model/UserModel.js";
import { asyncHandler } from "../../utils/response.js";






export const signup = asyncHandler(async (req, res, next) => {
    const { fullName, email, password, phone } = req.body;
    console.log(body);
    const checkUser = UserModel.findOne({ email });
    if(checkUser) {
        return res.status(409).json({ message: 'Email already exists' });
    }
    const user = new UserModel.create([{ fullName, email, password, phone }]);
    user.save();
    return res.status(201).json({ message: 'User created successfully', user });

},);

export const login =  asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        const user = UserModel.findOne({ email , password });
            if(!user) {
                return res.status(404).json({ message: 'invalid email or password' });
            }
            return res.status(200).json({ message: 'Login successful', user });
}
);

// {
//     "fullName":"elsayed atef",
//     "email":"elsayedatef469@gmail.com",
//     "password":"01023888997",
//     "phone":"01023888997"
// }