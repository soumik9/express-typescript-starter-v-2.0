import path from "path";
import { IApiReponse, IErrorResponse } from "../../app/modules";
import { ServerEnvironmentEnum } from "../enums";
import { config, errorLogger } from "../../config";
import { NextFunction, Request, RequestHandler, Response } from "express";

// @helper: Catch async errors
export const catchAsync = (fn: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
            errorLogger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

// @helper: Send success response
export const sendSuccessResponse = <T>(res: Response, data: IApiReponse<T>): void => {
    const responseData = {
        status_code: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || null,
        data: data.data || null,
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

// @helper: Get request full url
export const getRequestFulllUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

// @helper: Get request base url
export const getRequestBaseUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host');
}

// @helper: Get request path
export const getLocalRootPath = (): string => {
    return process.cwd();
};

// @helper: Get local file path
export const getLocalFilePath = (relativePath: string) => {
    const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(getLocalRootPath(), normalizedPath);
}