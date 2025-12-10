// import { IAdmin } from ".";
// import { Types } from "mongoose";
// import { IPhoneCountry } from "../../shared";
// import { getDocumentsFullPath, } from "../../../../libs/helper";
// import { AdminRoleEnum, FnFileReturnTypeEnum } from "../../../../libs/enum";

// // Base DTO
// export class AdminDto implements Partial<IAdmin> {
//     _id: Types.ObjectId;
//     name: string;
//     email: string;
//     phone: string;
//     admin_id: string;
//     country: IPhoneCountry;
//     image?: string;
//     role: AdminRoleEnum;
//     is_blocked: boolean;
//     created_at?: number;

//     constructor(admin: IAdmin) {
//         this._id = admin._id!;
//         this.name = admin.name;
//         this.admin_id = admin.admin_id;
//         this.email = admin.email;
//         this.phone = admin.phone;
//         this.country = admin.country;
//         this.image = getDocumentsFullPath(admin.image, FnFileReturnTypeEnum.Single);
//         this.role = admin.role;
//         this.is_blocked = admin.is_blocked;
//         this.created_at = Number(admin.created_at);
//     }
// }

// // DTO for response
// export class AdminDtoResponse extends AdminDto { }