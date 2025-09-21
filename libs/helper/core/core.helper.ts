import { config } from "../../../config";
import { ServerEnvironmentEnum } from "../../enum";
import { IApiReponse, IErrorResponse } from "../../../app/modules";
import { NextFunction, Request, RequestHandler, Response } from "express";

// @helper: Catch async errors
export const catchAsync = (fn: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };

// @helper: Send success response
export const sendSuccessResponse = <T>(res: Response, data: IApiReponse<T>): void => {
    const responseData = {
        status_code: data.statusCode,
        success: data.success,
        message: data.message ?? null,
        meta: data.meta ?? null,
        data: data.data ?? null,
    };

    res.status(data.statusCode).json(responseData);
};

// @helper: Send error response
export const sendErrorResponse = (res: Response, data: IErrorResponse): void => {

    const responseData = {
        status_code: data.statusCode,
        success: false,
        message: data.message || 'Something went wrong !',
        error_messages: data.errorMessages || [],
        stack: config.ENV !== ServerEnvironmentEnum.Production ? data.error?.stack || null : undefined,
        path: data.path || '',
    }

    res.status(data.statusCode).json(responseData);
};