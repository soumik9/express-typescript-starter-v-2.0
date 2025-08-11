import { Model } from "mongoose";
import { ICommonSchema, IPhoneCountry } from "../common";
import { AdminRoleEnum } from "../../../libs/enums";

export interface IAdmin extends ICommonSchema {
    name: string;
    phone: string;
    password: string;
    role: AdminRoleEnum;
    country: IPhoneCountry; // code, name, dial_code
}

// admin schema methods
export type IAdminMethods = {
    isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
} & Model<IAdmin>;