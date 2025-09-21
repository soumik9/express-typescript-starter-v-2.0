import httpStatus from 'http-status';
import { sendErrorResponse } from '../../libs/helper';
import { errorLogger, infoLogger } from '../../config';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// @middleware: parseRequestBody 
export const handleParseRequestBody: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body && typeof req.body.data === 'string') {

            // Simple check to prevent excessive large payloads
            if (req.body.data.length > 5_000_000) { // 5MB limit
                sendErrorResponse(res, {
                    statusCode: httpStatus.REQUEST_ENTITY_TOO_LARGE,
                    message: "Request data too large",
                    errorMessages: [{
                        path: "",
                        message: "Request data too large",

                    }],
                    error: null,
                    path: req.originalUrl || '',
                });
                return;
            }

            const parsedData = JSON.parse(req.body.data);

            // Merge parsed data with existing body
            req.body = { ...req.body, ...parsedData };
            infoLogger.info(`URL: ${req.originalUrl}, BODY: ${JSON.stringify(parsedData)}`); // Log the original body
            delete req.body.data;
        }
        next();
    } catch (error) {
        const err = error as Error;

        if (err instanceof SyntaxError) {
            sendErrorResponse(res, {
                statusCode: httpStatus.BAD_REQUEST,
                message: "Invalid JSON format",
                errorMessages: [{
                    path: "",
                    message: "Invalid JSON format",

                }],
                error: null,
                path: req.originalUrl || '',
            });
            return;
        }

        // Log detailed error information
        errorLogger.error("Middleware Error:", {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method
        });

        // Generic server error response
        sendErrorResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Server error processing request",
            errorMessages: [{
                path: "",
                message: "Server error processing request",

            }],
            error: null,
            path: req.originalUrl || '',
        });
        return;
    }
};