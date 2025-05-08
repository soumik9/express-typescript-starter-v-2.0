import mongoose from 'mongoose';
import { IErrorMessage, IErrorResponse } from '../../app';

const handleValidationError = (
    error: mongoose.Error.ValidationError
): IErrorResponse => {
    const errors: IErrorMessage[] = Object.values(error.errors).map(
        (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: el?.path,
                message: el?.message,
            };
        }
    );
    const statusCode = 400;
    return {
        statusCode,
        message: errors[0]?.message || 'Validation Error',
        errorMessages: errors,
    };
};

export default handleValidationError;