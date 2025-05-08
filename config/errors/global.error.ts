import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { config } from '../server';
import { IErrorMessage } from '../../app';
import handleValidationError from './validation.error';
import handleZodError from './zod.error';
import handleCastError from './cast.error';
import ApiError from './api.error';

const handleGlobalErrors: ErrorRequestHandler = (
    error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages: IErrorMessage[] = [];

    if (error?.name === 'ValidationError') {
        const simplifiedError = handleValidationError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    } else if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    } else if (error?.name === 'CastError') {
        const simplifiedError = handleCastError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    } else if (error instanceof MulterError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = error?.message;
        errorMessages = error?.message
            ? [
                {
                    path: '',
                    message: error?.message,
                },
            ]
            : [];
    } else if (error instanceof jwt.TokenExpiredError) {
        statusCode = httpStatus.UNAUTHORIZED;
        message = error?.message;
        errorMessages = error?.message
            ? [
                {
                    path: '',
                    message: 'Session has expired',
                },
            ]
            : [];
    } else if (error instanceof jwt.JsonWebTokenError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = error?.message;
        errorMessages = error?.message
            ? [
                {
                    path: '',
                    message: 'Session has invalid request',
                },
            ]
            : [];
    } else if (error instanceof ApiError) {
        statusCode = error?.statusCode;
        message = error.message;
        errorMessages = error?.message
            ? [
                {
                    path: '',
                    message: error?.message,
                },
            ]
            : [];
    } else if (error instanceof Error) {
        message = error?.message;
        errorMessages = error?.message
            ? [
                {
                    path: '',
                    message: error?.message,
                },
            ]
            : [];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config.ENV !== 'production' ? error?.stack : undefined,
    });
};

export default handleGlobalErrors;