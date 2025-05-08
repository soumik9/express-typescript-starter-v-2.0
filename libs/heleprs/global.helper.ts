import { NextFunction, Request, RequestHandler, Response } from "express";
import { errorLogger } from "../../config/logger/log.config";
import { IApiReponse } from "../../app";
import path from "path";
import moment from "moment";

// *Catch async errors
export const catchAsync = (fn: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
            errorLogger.error(error);
        }
    };

// *Send response
export const sendResponse = <T>(res: Response, data: IApiReponse<T>): void => {
    const responseData: IApiReponse<T> = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || null || undefined,
        data: data.data || null || undefined,
    };

    res.status(data.statusCode).json(responseData);
};


// *Get request full url
export const getRequestFulllUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

// *Get request base url
export const getRequestBaseUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host');
}

// *Get request path
export const getLocalRootPath = (): string => {
    return process.cwd();
};

// *Get local file path
export const getLocalFilePath = (relativePath: string) => {
    const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(getLocalRootPath(), normalizedPath);
}

// *Get timestamp
export const getCurrentTimestamp = (): string => {
    return moment().utc().format('YYYY-MM-DD HH:mm:ss');
};