import { promises as fsPromises } from "fs";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { getLocalFilePath, getLocalRootPath, sendErrorResponse } from "../../libs/helpers";
import { config } from "../../config";
import { ServerEnvironmentEnum } from "../../libs/enums";
import httpStatus from "http-status";

export const handleCheckPublicFileExists: RequestHandler = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {

        const decodedPath = decodeURI(req.originalUrl);
        const filePath = await getLocalFilePath(decodedPath);

        // Check if the requested path is trying to access files outside the intended directory
        if (!filePath.startsWith(getLocalRootPath())) {
            sendErrorResponse(res, {
                statusCode: httpStatus.UNAUTHORIZED,
                message: "Access Denied",
                errorMessages: [{
                    path: "",  // Not exposing the attempted path for security
                    message: "Invalid file path requested",

                }],
                error: null,
                path: req.originalUrl || '',
            });
            return;
        }

        // Check if file exists using the Promise-based API
        await fsPromises.access(filePath, fsPromises.constants.F_OK);

        // If execution reaches here, the file exists
        next();
    } catch (error) {
        sendErrorResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            message: "File Not Found",
            errorMessages: [{
                path: config.ENV === 'production' ? '' : req.originalUrl,  // Only expose path in non-production
                message: "Image not found or has been deleted."
            }],
            error: null,
            path: req.originalUrl || '',
        });
        return;
    }
};