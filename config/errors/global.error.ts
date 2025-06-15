import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import httpStatus from 'http-status';
import { config } from '../server';
import handleValidationError from './validation.error';
import handleZodError from './zod.error';
import handleCastError from './cast.error';
import ApiError from './api.error';
import { IErrorMessage } from '../../app/modules';
import { getCurrentTimestamp } from '../../libs/heleprs';

const handleGlobalErrors: ErrorRequestHandler = (
    error, req: Request, res: Response, next: NextFunction
): any => {

    // Default error state
    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages: IErrorMessage[] = [];

    // Error type mapping for consistent processing
    const errorHandlers: Record<string, () => void> = {
        ValidationError: () => {
            const result = handleValidationError(error);
            statusCode = result.statusCode;
            message = result.message;
            errorMessages = result.errorMessages;
        },

        CastError: () => {
            const result = handleCastError(error);
            statusCode = result.statusCode;
            message = result.message;
            errorMessages = result.errorMessages;
        },

        TokenExpiredError: () => {
            statusCode = httpStatus.UNAUTHORIZED;
            message = 'Your session has expired. Please log in again.';
            errorMessages = [{ path: '', message: 'Session has expired' }];
        },

        JsonWebTokenError: () => {
            statusCode = httpStatus.BAD_REQUEST;
            message = 'Invalid authentication token';
            errorMessages = [{ path: '', message: 'Session has invalid request' }];
        }
    };

    // Process known error types
    if (error?.name && errorHandlers[error.name]) {
        errorHandlers[error.name]();
    } else if (error instanceof ZodError) {
        const result = handleZodError(error);
        statusCode = result.statusCode;
        message = result.message;
        errorMessages = result.errorMessages;
    } else if (error instanceof MulterError) {
        statusCode = httpStatus.BAD_REQUEST; // Changed from 500 to 400 for client errors
        message = 'File upload error';
        errorMessages = [{ path: '', message: error.message || 'Error uploading file' }];
    } else if (error instanceof ApiError) {
        statusCode = error.statusCode;
        message = error.message;
        errorMessages = [{ path: '', message: error.message || 'API Error' }];
    } else if (error instanceof Error) {
        // Generic error handling
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = config.ENV === 'production' ? 'An unexpected error occurred' : error.message;
        errorMessages = [{ path: '', message: error.message || 'Unknown error' }];
    }

    // Return standardized error response
    return res.json({
        statusCode,
        success: false,
        message,
        errorMessages,
        stack: config.ENV !== 'production' ? error?.stack : undefined,
        timestamp: getCurrentTimestamp(),
        path: req.originalUrl || '',
    });
};

export default handleGlobalErrors;