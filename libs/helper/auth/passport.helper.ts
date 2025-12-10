import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../../../config";

// @helper: passport jwt strategy verify function
export const passportJwtVerify = (payload: JwtPayload, done: Function) => {
    // Admin.findOne({ _id: payload._id })
    //     .then(verifyAdmin => {
    //         if (!verifyAdmin)
    //             return done(new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!'), false);

    //         if (verifyAdmin.is_blocked)
    //             return done(new ApiError(httpStatus.UNAUTHORIZED, 'Your account is blocked!'), false);

    //         return done(null, verifyAdmin);
    //     })
    //     .catch(error => done(error, false));
};