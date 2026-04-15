// admin.dto.ts
import { Types } from "mongoose";
import { IPhoneCountry } from "../shared/common";
import { FileInstance } from "../../../libs/helper";
import { IAdmin, IAdminResponse } from "./admin.interface";
import { AdminRoleEnum, FnFileReturnTypeEnum } from "../../../libs/enum";

// Base DTO
export class AdminDto implements IAdminResponse {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    country: IPhoneCountry;
    image: string;
    role: AdminRoleEnum;
    is_blocked: boolean;
    created_at: number;

    constructor(admin: IAdmin) {
        this._id = admin._id! as Types.ObjectId;
        this.name = admin.name;
        this.email = admin.email;
        this.phone = admin.phone;
        this.country = admin.country;
        this.image = FileInstance.url(admin.image?.path, FnFileReturnTypeEnum.Single);
        this.role = admin.role;
        this.is_blocked = admin.is_blocked;
        this.created_at = Number(admin.created_at);
    }
}

// DTO for response
export class AdminDtoResponse extends AdminDto { }