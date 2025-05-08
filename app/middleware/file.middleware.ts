import { promises as fsPromises } from "fs";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { config } from "../../config";
import { getLocalFilePath, getLocalRootPath } from "../../libs";

export const handleCheckPublicFileExists: RequestHandler = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        // Decode the original URL to handle spaces and special characters
        const decodedPath = decodeURI(req.originalUrl);

        // Build the file path based on the process current working directory
        const filePath = await getLocalFilePath(decodedPath);

        // Check if the requested path is trying to access files outside the intended directory
        if (!filePath.startsWith(getLocalRootPath())) {
            res.status(403).json({
                success: false,
                message: "Access Denied",
                errorMessages: [{
                    path: "",  // Not exposing the attempted path for security
                    message: "Invalid file path requested"
                }]
            });
            return; // void return, not returning res.status().json()
        }

        // Check if file exists using the Promise-based API
        await fsPromises.access(filePath, fsPromises.constants.F_OK);

        // If execution reaches here, the file exists
        next();
    } catch (error) {
        // File does not exist or cannot be accessed
        res.status(404).json({
            success: false,
            message: "File Not Found",
            errorMessages: [{
                path: config.ENV === 'production' ? '' : req.originalUrl,  // Only expose path in non-production
                message: "Image not found or has been deleted."
            }]
        });
        return; // void return, not returning res.status().json()
    }
};