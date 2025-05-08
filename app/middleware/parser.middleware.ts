import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { ApiError, config, errorLogger } from '../../config';

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

// *parseQueryData function*
export const handleParseQuery = <T extends Record<string, any>>(
    query: Record<string, any>,
    options: {
        defaults?: Partial<T>;
        transforms?: Record<string, (value: any) => any>;
        required?: Array<keyof T>;
    } = {}
): T => {
    const { defaults = {}, transforms = {}, required = [] } = options;
    const result = { ...defaults } as T;

    // Process all query parameters
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;

        const k = key as keyof T;
        // Use type assertion with a simpler check
        const transform = transforms[key];

        if (typeof transform === 'function')
            result[k] = transform(value);
        else
            result[k] = value;
    }

    // Validate required fields
    for (const field of required) {
        if (result[field] === undefined)
            throw new ApiError(httpStatus.NOT_FOUND, `Missing required query parameter: ${String(field)}`);
    }

    return result;
};

// Example usage:
/*
 Using with your current parameters
const { page, limit, user_id } = parseQueryData(req.query, {
    defaults: {
        page: 1,
        limit: 999999,
        user_id: null,
    },
    transforms: {
        page: (v) => parseInt(v, 10),
        limit: (v) => parseInt(v, 10),
        user_id: (v) => v?.toString(),
    }
});
*/