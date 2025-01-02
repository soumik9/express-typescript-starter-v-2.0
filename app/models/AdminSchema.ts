import { Schema, model, Types } from 'mongoose';
import { NextFunction } from 'connect';
import validator from "validator";
import moment from 'moment';
import { comparePassword, generateHash } from '../../libs/heleprs/bcrypt';
import { IAdmin, IAdminMethods } from '../interfaces/IAdmin';

const AdminSchema = new Schema<IAdmin, {}, IAdminMethods>({
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
    createdAt: {
        type: Number,
        default: () => moment().unix(),
    },
    updatedAt: {
        type: Number,
        default: () => moment().unix(),
    },
});

// checking is password matched
AdminSchema.methods.isPasswordMatched = async function (givenPassword: string, savedPassword: string): Promise<boolean> {
    return await comparePassword(givenPassword, savedPassword);
}

// create or save works for both
AdminSchema.pre("save", async function (next: NextFunction) {
    if (!this.isModified("password")) {
        return next();
    }

    const password = this.password;
    const hashedPassword = await generateHash(password);

    this.password = hashedPassword;
    this.confirmPassword = undefined;

    next();
});

const Admin = model<IAdmin>("Admin", AdminSchema);
export default Admin;