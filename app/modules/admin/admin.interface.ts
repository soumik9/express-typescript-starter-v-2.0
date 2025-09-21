import { ICommonModel } from "../core";
import { IPhoneCountry } from "../common";
import { AdminRoleEnum } from "../../../libs/enum";

export interface IAdmin extends ICommonModel {
    name: string;
    phone: string;
    password: string;
    role: AdminRoleEnum;
    country: IPhoneCountry; // code, name, dial_code
}