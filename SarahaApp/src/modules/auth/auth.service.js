import UserModel from "../../db/model/UserModel.js";

export const signup =  (req, res, next) => {
    try{
        const { fullName, email,  password, phone } = req.body;
        console.log(body);
        const checkUser = UserModel.findOne({ email });
        if(checkUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        const user = new UserModel.create([{ fullName, email, password, phone }]);
        user.save();
        return res.status(201).json({ message: 'User created successfully', user });
    }catch(error){
        return res.status(500).json({ message_error: 'Internal Server Error', error, message: error.message , stack: error.stack });
    }
}

export const login =  (req, res, next) => {
        try{
            const { email, password } = req.body;
            const user = UserModel.findOne({ email  });
            if(!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if(user.password !== password || user.email !== email) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            return res.status(200).json({ message: 'Login successful', user });
        }catch(error){
            return res.status(500).json({ message_error: 'Internal Server Error', error, message: error.message , stack: error.stack });
        }
}

// {
//     "fullName":"elsayed atef",
//     "email":"elsayedatef469@gmail.com",
//     "password":"01023888997",
//     "phone":"01023888997"
// }