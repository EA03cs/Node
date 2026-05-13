import jwt from 'jsonwebtoken';

export const generateToken = ({payload ,signature = "elsayed", options= {expiresIn: 60*60}}={}) => {
    return jwt.sign(payload, signature, options);
}