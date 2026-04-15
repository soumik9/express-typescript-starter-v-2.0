// admin.service.ts
import { Model } from "mongoose";
import { IAdmin } from "./admin.interface";
import { BaseService } from "../shared/base";
import { AdminDtoResponse } from "./admin.dto";

// Inject the model instead of importing it directly
export class AdminService extends BaseService<IAdmin> {
    constructor(
        adminModel: Model<IAdmin>,
    ) {
        super("Admin", adminModel, AdminDtoResponse);
    }

}