import z from "zod";
import httpStatus from "http-status";
import { ApiError } from "../../../config";

// @helper: Zod Preprocess with default value
export const zodPreprocess = (defaultValue: any, schema: z.ZodTypeAny) => {
    return z.preprocess(
        (value) => value === undefined ? defaultValue : value,
        schema
    );
};

// @helper: Zod Schema Validate
export const zodSchemaValidate = (schema: any, payload: unknown) => {
    const result = schema.safeParse(payload);

    if (!result.success) {
        const message = result.error.issues
            .map((issue: any) => issue.message)
            .join(", ");

        throw new ApiError(httpStatus.BAD_REQUEST, message);
    }

    return result.data;
};
