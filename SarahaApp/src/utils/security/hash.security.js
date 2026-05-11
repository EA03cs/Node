import bcrypt from "bcryptjs";
export const generatehashPassword = async ({plainText = "" , salt = 12} = {}) => {
    return bcrypt.hashSync(plainText, parseInt(salt));
};
export const comparePassword = async ({plainText = "", hashValue = ""} = {}) => {
    return bcrypt.compareSync(plainText, hashValue);
};