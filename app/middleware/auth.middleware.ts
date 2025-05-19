import { NextFunction, Request, Response } from "express";
import { Secret } from 'jsonwebtoken'
import ApiError from "../../config/errors/api.error";
import httpStatus from "http-status";
import { config } from "../../config/server/config.server";
import { verifyToken } from "../../libs/heleprs";

export default (...requiredPermissions: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');

        // getting token
        const token = authHeader.split(' ')[1];

        // verify token
        let verifiedUser = null;
        verifiedUser = verifyToken(token, config.TOKEN.SECRET as Secret);

        // const verifyDoc = await Admin.findById(verifiedUser._id).select("name").populate("role").lean();
        // if (!verifyDoc)
        //     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please contact admin!');

        // const loggedUserRole = verifyDoc.role as IRole;
        // const loggedUserPermissions = loggedUserRole.permissions;
        // req.user = verifiedUser;  // email, _id, business

        // If any of the required permissions are missing, throw Forbidden error
        // if (requiredPermissions.length && !requiredPermissions.some(permission => loggedUserPermissions.includes(permission)))
        //     throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');

        next();
    } catch (error) {
        next(error);
    }
}