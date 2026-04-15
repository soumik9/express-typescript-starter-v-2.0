// admin.interface.ts
import { ICommonModel } from "../shared/core";
import { AdminRoleEnum } from "../../../libs/enum";
import { ICommonDoc, IPhoneCountry } from "../shared/common";

// admin schema interface
export interface IAdmin extends ICommonModel {
    name: string;
    image: ICommonDoc;
    email: string;
    phone: string;
    country: IPhoneCountry; // code, name, dial_code
    password: string;
    role: AdminRoleEnum;
    is_blocked: boolean;
}

export type IAdminResponse = Pick<IAdmin,
    "name" | "email" | "phone" | "country" | "role" | "is_blocked"
> & {
    image: string;
};