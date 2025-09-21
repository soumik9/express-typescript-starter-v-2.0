import z from "zod";

// @helper: Zod Preprocess with default value
export const zodPreprocess = (defaultValue: any, schema: z.ZodTypeAny) => {
    return z.preprocess(
        (value) => value === undefined ? defaultValue : value,
        schema
    );
};