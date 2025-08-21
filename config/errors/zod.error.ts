import { ZodError } from 'zod';
import { IGenericErrorMessage, IGenericErrorResponse } from '../../app/modules';

const handleZodError = (error: ZodError): IGenericErrorResponse => {

    const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodError['issues'][number]) => {
        const pathString = issue.path.length > 0 ? issue.path.join('.') : '';

        return {
            path: pathString,
            message: issue.message,
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