import { Model } from "mongoose";
import { ICommonSchema } from "./ICommon";

export interface IAdminLoginResponse extends IAdmin {
    accessToken: string;
    permissions?: string[];
}

// admin schema interface
export interface IAdmin extends ICommonSchema {
    firstName: string;
    lastName: string;
    phone: string;
    image: string;
    email: string;
    password: string;
    confirmPassword: string | undefined;
    // role: string | Types.ObjectId | IRole;
    isEmailVerified: boolean;
}

// admin schema methods
export type IAdminMethods = {
    isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
} & Model<IAdmin>;