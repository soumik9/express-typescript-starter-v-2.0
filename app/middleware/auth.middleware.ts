import httpStatus from "http-status";
import { ApiError, config } from "../../config";
import { verifyToken } from "../../libs/helpers";
import { JwtPayload, Secret } from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";

export const authMiddleware = (...requiredRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract and validate the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');

        // getting token
        const token = authHeader.split(' ')[1];

        // Verify the token and decode user data
        const verifiedToken: JwtPayload = verifyToken(String(token), config.TOKEN.SECRET as Secret);
        if (!verifiedToken || !verifiedToken._id)
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');

        // finding user
        // const verifyDoc = await findUserAdminOrThrow({
        //     query: { _id: verifiedToken._id }, isItemShouldExist: true, filterWithDto: false
        // }) as IUserAdmin;

        // check if user is blocked
        // if (verifyDoc.is_blocked)
        //     throw new ApiError(httpStatus.UNAUTHORIZED, 'Your account is blocked!');

        // assign user data to req object
        // req.user = {
        //     _id: verifiedToken._id, email: verifyDoc.email, role: verifyDoc.role, name: verifyDoc.name,
        // };

        // If any of the required permissions are missing, throw Forbidden error
        // if (requiredRoles.length && !requiredRoles.includes(verifyDoc.role))
        //     throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');

        next();
    } catch (error) {
        next(error);
    }
}