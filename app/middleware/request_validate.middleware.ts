import { ZodJSONSchema } from 'zod';
import { errorLogger } from '../../config';
import { NextFunction, Request, Response } from 'express';

export const zodRequestValidator = (schema: ZodJSONSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            if (!schema) {
                errorLogger.error(`Zod Schema is undefined: ${req.originalUrl}`);
                return next(new Error("Validation schema is undefined"));
            }

            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });
            return next();
        } catch (error) {
            next(error);
        }
    };