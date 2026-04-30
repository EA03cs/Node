import mongoose from "mongoose";

export let genderEnum = {
    male: "male",
    female: "female"
};
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },  
    gender: {
        type: String,
        required: true,
        enum: {
            values: Object.values(genderEnum),
            message: "Gender only allows ${object.values(genderEnum)}",
        },
        default: genderEnum.male,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    confirmEmail: {
        type: Date,
        default: false,
    }
}, { timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
 });
userSchema.virtual("fullName").set(function (value) {
    const [firstName, lastName] = value.split(" ");  
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
UserModel.syncIndexes();
export default UserModel;