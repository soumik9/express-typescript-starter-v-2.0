// // admin.service.ts
// import { Model } from "mongoose";
// import { BaseService } from "../../shared";
// import { IAdmin } from "./admin.interface";
// import { AdminDtoResponse } from "./admin.dto";

// // Inject the model instead of importing it directly
// export class AdminService extends BaseService<IAdmin> {
//     constructor(
//         adminModel: Model<IAdmin>,
//     ) {
//         super("Admin", adminModel, AdminDtoResponse);
//     }
// }