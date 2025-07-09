import { model, Schema } from "mongoose";
import { IAdmin, IAdminMethods } from "./admin.interface";
import { comparePassword, generateHash } from "../../../libs/heleprs";
import { CommonSchema } from "../common";

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
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        default: "admin",
    },
});

// Inherit from CommonSchema
AdminSchema.add(CommonSchema);

// Method to verify if the password matches
AdminSchema.methods.isPasswordMatched = async function (givenPassword: string): Promise<boolean> {
    return await comparePassword(givenPassword, this.password);
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

const Admin = model<IAdmin>("Admin", AdminSchema);
export default Admin;