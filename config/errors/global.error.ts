import { ZodError } from 'zod';
import { config } from '../server';
import httpStatus from 'http-status';
import { MulterError } from 'multer';
import { errorLogger } from '../logger';
import { IErrorMessage } from '../../app/modules';
import { ServerEnvironmentEnum } from '../../libs/enum';
import { ResponseServiceInstance } from '../../libs/helper';
import { ApiError, ErrorHandlerInstance } from './custom.error';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

type KnownErrors = 'ValidationError' | 'CastError' | 'TokenExpiredError' | 'JsonWebTokenError';

const handleGlobalErrors: ErrorRequestHandler = (
    error, req: Request, res: Response, next: NextFunction
): any => {

    // Default error state
    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages: IErrorMessage[] = [];

    // Error type mapping for consistent processing
    const errorHandlers: Record<KnownErrors, () => void> = {
        ValidationError: () => {
            const result = ErrorHandlerInstance.validation(error);
            statusCode = result.statusCode;
            message = result.message;
            errorMessages = result.errorMessages;
        },

        CastError: () => {
            const result = ErrorHandlerInstance.cast(error);
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

    const handler = error?.name ? errorHandlers[error.name as KnownErrors] : undefined;

    // Process known error types
    if (handler)
        handler();
    else if (error instanceof ZodError) {
        const result = ErrorHandlerInstance.zod(error);
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
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = config.ENV === ServerEnvironmentEnum.Production ? 'An unexpected error occurred' : error.message;
        errorMessages = [{ path: '', message: error.message || 'Unknown error' }];
    } else {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = 'Unknown server error';
        errorMessages = [{ path: '', message: 'Something went wrong' }];
    }

    // show the error
    if (config.ENV !== ServerEnvironmentEnum.Production) {
        errorLogger.error(`[ERROR] : ${error.message}`);
    }

    // Return standardized error response
    return ResponseServiceInstance.error(res, {
        statusCode,
        message,
        errorMessages,
        error,
        path: req.originalUrl || '',
    });
};

export default handleGlobalErrors;