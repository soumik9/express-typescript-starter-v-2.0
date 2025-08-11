import { Schema, model } from 'mongoose';
import { NextFunction } from 'connect';
import validator from "validator";
import { IUser, IUserMethods } from './user.interface';
import { CommonSchema } from '../common';
import { comparePassword, generateHash } from '../../../libs/helpers';

const UserSchema = new Schema<IUser, {}, IUserMethods>({
    firstName: {
        type: String,
        required: [true, 'First Name field is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name field is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone field is required']
    },
    image: String,
    email: {
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    password: {
        type: String,
        // required: [true, 'Password field is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    confirmPassword: {
        type: String,
        // required: [true, "Please confirm your password"],
    },
    // role: {
    //     type: Types.ObjectId,
    //     ref: "Role",
    //     required: [true, "Please give your role"],
    // },
});

// Inherit from CommonSchema
UserSchema.add(CommonSchema);

// checking is password matched
UserSchema.methods.isPasswordMatched = async function (givenPassword: string, savedPassword: string): Promise<boolean> {
    return await comparePassword(givenPassword, savedPassword);
}

// create or save works for both
UserSchema.pre("save", async function (next: NextFunction) {
    if (!this.isModified("password")) {
        return next();
    }

    const password = this.password;
    const hashedPassword = await generateHash(password);

    this.password = hashedPassword;
    this.confirmPassword = undefined;

    next();
});

const User = model<IUser>("User", UserSchema);
export default User;