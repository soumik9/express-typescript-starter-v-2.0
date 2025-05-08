import { Request, RequestHandler, Response } from "express";
import { catchAsync, sendResponse } from "../../../libs";
import User from "./user.model";
import { IUser } from "./user.interface";
import httpStatus from "http-status";

// get user by id
export const GetUserById: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {

        // finding profile data
        const result = await User.findById("abc").select("-password");

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Profile retrieved successfully!',
            data: result,
        });
    }
)