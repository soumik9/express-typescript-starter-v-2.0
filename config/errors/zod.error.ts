import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorMessage, IGenericErrorResponse } from '../../app/modules';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue?.message,
        };
    });

    const statusCode = 400;

    return {
        statusCode,
        message: errors[0]?.message || 'Validation Error',
        errorMessages: errors,
    };
};

export default handleZodError;