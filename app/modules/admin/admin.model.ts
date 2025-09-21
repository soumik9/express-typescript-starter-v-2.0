import { IAdmin } from ".";
import { CommonSchema } from "../core";
import { model, Schema } from "mongoose";
import { PhoneCountrySchema } from "../common";
import { AdminRoleEnum } from "../../../libs/enum";
import { generateHash } from "../../../libs/helper";

const AdminSchema = new Schema<IAdmin>({
    name: {
        type: String,
        required: [true, 'Name field is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    country: PhoneCountrySchema,
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: {
            values: Object.values(AdminRoleEnum),
            message: 'Invalid role type, must be one of: ' + Object.values(AdminRoleEnum).join(', '),
        },
        required: [true, 'Role type is required'],
    }
});

// Inherit from CommonSchema
AdminSchema.add(CommonSchema);

// Pre-save hook for hashing password before saving
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const password = this.password;
    const hashedPassword = await generateHash(String(password));
    this.password = hashedPassword;
    next();
});

export const Admin = model<IAdmin>("Admin", AdminSchema);