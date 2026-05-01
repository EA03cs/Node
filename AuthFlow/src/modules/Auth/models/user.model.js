import e from 'express';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone : String
});

export const User = mongoose.model('User', userSchema);
User.syncIndexes();
export default User;