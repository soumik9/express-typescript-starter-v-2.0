// admin.zod.ts
import { z } from "zod";
import { AdminRoleEnum } from "../../../libs/enum";
import { ZodInstance } from "../../../libs/helper/utils";

class AdminZodSchema {
    private static instance: AdminZodSchema;

    private constructor() { }

    /** Singleton accessor */
    public static getInstance(): AdminZodSchema {
        if (!AdminZodSchema.instance) {
            AdminZodSchema.instance = new AdminZodSchema();
        }
        return AdminZodSchema.instance;
    }

    /** ============================
     * Sub Schemas
     * ============================
     */
    private readonly countrySchema = z.object({
        code: z.string().nonempty({ message: "Country code is required" }),
        name: z.string().nonempty({ message: "Country name is required" }),
        dial_code: z.string().nonempty({ message: "Dial code is required" }),
    });

    /** ============================
     * Base Schemas
     * ============================
     */
    public readonly base = z.object({
        name: ZodInstance.preprocess(
            "",
            z.string().nonempty({ message: "Name field is required" })
        ),
        email: ZodInstance.preprocess(
            "",
            z
                .email({ message: "Invalid email address" })
                .nonempty({ message: "Email field is required" })
        ),
        phone: ZodInstance.preprocess(
            "",
            z.string().nonempty({ message: "Phone field is required" })
        ),
        country: this.countrySchema,
        role: ZodInstance.preprocess(
            "",
            z.string().refine(
                (val) => Object.values(AdminRoleEnum).includes(val as AdminRoleEnum),
                { message: `Role must be one of: ${Object.values(AdminRoleEnum).join(", ")}` }
            )
        ),
    });

    public readonly baseIdQuery = z.object({
        admin_id: ZodInstance.preprocess(
            "",
            z.string().nonempty({ message: "Query: Admin ID is required" })
        ),
    });

    /** ============================
     * Public Schemas
     * ============================
     */

    public readonly create = z.object({
        body: this.base,
    });

    public readonly getById = z.object({
        query: this.baseIdQuery,
    });

    public readonly update = z.object({
        query: this.baseIdQuery,
        body: this.base.partial(),
    });
}

// Export singleton instance
export const AdminZodSchemaInstance = AdminZodSchema.getInstance();