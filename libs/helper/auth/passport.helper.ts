import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Model, Document } from "mongoose";
import { ApiError } from "../../../config";

export class PassportService<T extends Document> {
    private static instances: Map<string, PassportService<any>> = new Map();

    private constructor(
        private model: Model<T>,
    ) { }

    /** Singleton accessor per model */
    public static getInstance<U extends Document>(name: string, model: Model<U>): PassportService<U> {
        if (!PassportService.instances.has(name)) {
            PassportService.instances.set(name, new PassportService<U>(model));
        }
        return PassportService.instances.get(name)!;
    }

    /** Passport JWT verify callback */
    public verify = async (payload: JwtPayload, done: (err: any, user?: T | false) => void): Promise<void> => {
        try {
            const user = await this.model.findById(payload._id).lean();

            if (!user) {
                return done(new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!"), false);
            }

            // if (this.blockCheckField && (user[this.blockCheckField] as unknown) === true) {
            //     return done(new ApiError(httpStatus.UNAUTHORIZED, "Your account is blocked!"), false);
            // }

            // return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    };
}

// const AdminPassportService = PassportService.getInstance("Admin", Admin);
