import passport from "passport";
import httpStatus from "http-status";
import { ApiError } from "../../config";
import { PassportKeyEnum } from "../../libs/enum";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = (...requiredRoles: string[]) => (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        passport.authenticate(PassportKeyEnum.JwtAuth, { session: false }, (err: any, admin: any, info: any) => {
            if (err || !admin)
                return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access'));

            if (requiredRoles.length && !requiredRoles.includes(admin.role))
                return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));

            req.admin = {
                _id: admin._id, email: admin.email, role: admin.role, name: admin.name,
            };
            next();
        })(req, res, next);
    } catch (error) {
        next(error);
    }
}