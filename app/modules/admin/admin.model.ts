import { model, Schema } from "mongoose";
import { CommonSchema } from "../common";
import { IAdmin, IAdminMethods } from ".";
import { AdminRoleEnum } from "../../../libs/enums";
import { compareHash, generateHash } from "../../../libs/helpers";

const AdminSchema = new Schema<IAdmin, {}, IAdminMethods>({
    name: {
        type: String,
        required: [true, 'Name field is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    country: {
        code: {
            type: String,
            required: [true, 'Country code is required'],
        },
        name: {
            type: String,
            required: [true, 'Country name is required'],
        },
        dial_code: {
            type: String,
            required: [true, 'Country dial code is required'],
        },
    },
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

// Method to verify if the password matches
AdminSchema.methods.isPasswordMatched = async function (givenPassword: string): Promise<boolean> {
    return await compareHash(givenPassword, this.password);
};

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