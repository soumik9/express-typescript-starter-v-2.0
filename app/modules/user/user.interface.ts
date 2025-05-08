import { Model } from "mongoose";
import { ICommonSchema } from "../common";

export interface IUserLoginResponse extends IUser {
    accessToken: string;
    permissions?: string[];
}

// admin schema interface
export interface IUser extends ICommonSchema {
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
export type IUserMethods = {
    isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
} & Model<IUser>;