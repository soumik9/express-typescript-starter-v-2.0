// admin.model.ts
import validator from "validator";
import { NextFunction } from 'connect';
import { Schema, model } from 'mongoose';
import { IAdmin } from "./admin.interface";
import { SecurityInstance } from "../../../libs/helper";
import { CommonSchema } from "../shared/core/core.model";
import { AdminRoleEnum, ModelEnum } from "../../../libs/enum";
import { DocumentSchema, PhoneCountrySchema } from "../shared/common";

const AdminSchema = new Schema<IAdmin>({
    name: {
        type: String,
        required: [true, 'First Name field is required']
    },
    image: DocumentSchema,
    email: {
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    phone: {
        type: String,
        required: [true, 'Phone field is required']
    },
    country: PhoneCountrySchema,
    password: {
        type: String,
        required: [true, 'Password field is required'],
    },
    role: {
        type: String,
        enum: {
            values: Object.values(AdminRoleEnum),
            message: '{VALUE} is not supported, must be one of ' + Object.values(AdminRoleEnum).join(', '),
        },
        required: [true, 'Role field is required'],
    },
    is_blocked: {
        type: Boolean,
        default: false,
    },
});

// Inherit from CommonSchema
AdminSchema.add(CommonSchema);

// create or save works for both
AdminSchema.pre("save", async function (next: NextFunction) {
    if (!this.isModified("password")) {
        return next();
    }

    const password = this.password;
    const hashedPassword = await SecurityInstance.generateHash(String(password));
    this.password = hashedPassword;
    next();
});

export const Admin = model<IAdmin>(ModelEnum.Admin, AdminSchema);