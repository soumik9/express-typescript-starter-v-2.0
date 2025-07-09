import { Model } from "mongoose";
import { ICommonSchema } from "../common";

export interface IAdmin extends ICommonSchema {
    name: string;
    phone: string;
    password: string;
    role: 'admin';
}

// admin schema methods
export type IAdminMethods = {
    isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
} & Model<IAdmin>;