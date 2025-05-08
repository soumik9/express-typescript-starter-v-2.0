import { z } from "zod";

const BaseUserDtoZodSchema = z.object({
    firstName: z.string().min(1, { message: "First Name field is required" }),
    lastName: z.string().min(1, { message: "Last Name field is required" }),
    phone: z.string().min(1, { message: "Phone field is required" }),
    image: z.string().optional(),
    email: z
        .string()
        .min(1, { message: "Email field is required" })
        .email({ message: "Please provide a valid email" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .optional(),
    confirmPassword: z.string().optional(),
});

// add DTO schema
export const UserAddDtoZodSchema = BaseUserDtoZodSchema.omit({
    firstName: true,
    lastName: true,
});

// Update DTO schema
export const UserUpdateDtoZodSchema = BaseUserDtoZodSchema.partial();