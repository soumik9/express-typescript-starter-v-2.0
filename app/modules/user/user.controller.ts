import User from "./user.model";
import httpStatus from "http-status";
import { IUser } from "./user.interface";
import { Request, RequestHandler, Response } from "express";
import { catchAsync, sendSuccessResponse } from "../../../libs/helper";

// get user by id
export const GetUserById: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {

        // finding profile data
        const result = await User.findById("abc").select("-password");

        sendSuccessResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Profile retrieved successfully!',
            data: result,
        });
    }
)