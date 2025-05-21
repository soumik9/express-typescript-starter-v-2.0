import httpStatus from 'http-status';
import { config, errorLogger, infoLogger } from '../../config';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// *parseRequestBody middleware*
export const handleParseRequestBody: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body && typeof req.body.data === 'string') {

            // Simple check to prevent excessive large payloads
            if (req.body.data.length > 5_000_000) { // 5MB limit
                res.status(httpStatus.REQUEST_ENTITY_TOO_LARGE).json({
                    message: "Request data too large",
                });
                return; // void return
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
            // Specific handling for JSON parsing errors
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Invalid JSON format",
                stack: config.ENV === 'production' ? undefined : err.message
            });
            return; // void return
        }

        // Log detailed error information
        errorLogger.error("Middleware Error:", {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method
        });

        // Generic server error response
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error processing request",
            error: config.ENV === 'production' ? undefined : err.message
        });
        return; // void return
    }
};

// *parseQueryData function
export const handleParseQuery = (query: any): {
    page: number; limit: number;
    [key: string]: string | number;
} => {

    //pagination
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 999999;

    const user_id = query.user_id ? query.user_id.toString() : null;
    const email = query.email ? query.email.toString() : null;

    return {
        page,
        limit,

        user_id,
        email,
    }
}