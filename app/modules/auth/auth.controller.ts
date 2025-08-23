import httpStatus from "http-status";
import { ApiError } from "../../../config/errors";
import { Request, RequestHandler, Response } from "express";
import { catchAsync, sendSuccessResponse } from "../../../libs/helpers";

// signin controller
export const Signin: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {

        // parsing data
        const body = req.body && req.body.data ? JSON.parse(req.body.data) : {};
        const { email, password: reqPassword } = body;

        // checking email and password given
        if (!email || !reqPassword)
            throw new ApiError(httpStatus.NOT_FOUND, 'Information missing!');

        // finding user
        // const user = await Admin.findOne({ email }).populate({ path: 'role', select: 'name permissions' }).lean();
        // const role = user?.role as IRole;
        // if (!user)
        //     throw new ApiError(httpStatus.NOT_FOUND, 'You are not a registered user!');

        // checking is valid password
        // const isValidPassword = await compareString(reqPassword, user.password);
        // if (!isValidPassword)
        //     throw new ApiError(httpStatus.UNAUTHORIZED, 'Credential mismatch!');

        // generating token
        // const token = generateToken(user);

        // user data to send with response
        // const { password, ...pwd } = user;

        sendSuccessResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Login Success!',
            // data: {
            //     accessToken: token as string,
            //     _id: pwd._id,
            // },
        });
    }
)

// profile of logged User
// const Profile: RequestHandler = catchAsync(
//     async (req: Request, res: Response) => {

// finding profile data
//     const result = await Admin.findById(req.user?._id).select("-password");

//     sendResponse<IAdmin>(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Profile retrieved successfully!',
//         data: result,
//     });
// }
// )
