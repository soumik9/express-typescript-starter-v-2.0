import httpStatus from "http-status";
import { config } from "../../config";
import { promises as fsPromises } from "fs";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ResponseInstance, ServerUtilityInstance } from "../../libs/helper";

export const handleCheckPublicFileExists: RequestHandler = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        // Decode the original URL to handle spaces and special characters
        const decodedPath = decodeURI(req.originalUrl);

        // Build the file path based on the process current working directory
        const filePath = ServerUtilityInstance.getLocalFilePath(decodedPath);

        // Check if the requested path is trying to access files outside the intended directory
        if (!filePath.startsWith(ServerUtilityInstance.rootPath())) {
            ResponseInstance.error(res, {
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
        ResponseInstance.error(res, {
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