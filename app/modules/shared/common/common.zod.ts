import z from "zod";

// Zod Schema
export const SendEmailSchema = z.object({
    toEmail: z.email({ message: "Invalid email address" }).nonempty({ message: "TO Email is required" }),
    subject: z.string({ message: "Subject is required" }).nonempty({ message: "Subject is required" }),
    template: z.string({ message: "Template is required" }).nonempty({ message: "Template is required" }),
    data: z.record(z.string(), z.any()).optional(),
    fromEmail: z.email({ message: "Invalid email address" }).nonempty({ message: "From Email is required" }).optional(),
    isUseCache: z.boolean().optional(),
});