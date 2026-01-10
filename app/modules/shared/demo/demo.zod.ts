// // admin.zod.ts
// import { z } from "zod";
// import { PhoneCountryZodSchema } from "../../shared";
// import { ZodInstance } from "../../../../libs/helper";
// import { AdminRoleEnum } from "../../../../libs/enum";

// class AdminZodSchema {
//     private static instance: AdminZodSchema;

//     private constructor() { }

//     /** Singleton accessor */
//     public static getInstance(): AdminZodSchema {
//         if (!AdminZodSchema.instance) {
//             AdminZodSchema.instance = new AdminZodSchema();
//         }
//         return AdminZodSchema.instance;
//     }

//     /** ───────────────────────────────
//      * Base Schemas (Lazy Loaded via Getters)
//      * ─────────────────────────────── */

//     public get base() {
//         return z.object({
//             name: ZodInstance.preprocess(
//                 "",
//                 z.string().nonempty({ message: "Name field is required" })
//             ),

//             email: ZodInstance.preprocess(
//                 "",
//                 z.email({ message: "Invalid email address" })
//                     .nonempty({ message: "Email field is required" })
//             ),

//             phone: ZodInstance.preprocess(
//                 "",
//                 z.string().nonempty({ message: "Phone field is required" })
//             ),

//             country: ZodInstance.preprocess(
//                 "",
//                 PhoneCountryZodSchema
//             ),

//             password: ZodInstance.preprocess(
//                 undefined,
//                 z.string().min(6, { message: "Password must be at least 6 characters long" }).optional()
//             ),

//             role: ZodInstance.preprocess(
//                 "",
//                 z.string().refine(
//                     val => Object.values(AdminRoleEnum).includes(val as AdminRoleEnum),
//                     { message: `Role must be one of: ${Object.values(AdminRoleEnum).join(", ")}` }
//                 )
//             ),
//         });
//     }

//     public get baseIdQuery() {
//         return z.object({
//             admin_id: ZodInstance.preprocess(
//                 "",
//                 z.string().nonempty({ message: "Query: Admin ID is required" }),
//             ),
//         });
//     }

//     /** ───────────────────────────────
//      * Public Schemas
//      * ─────────────────────────────── */

//     public get create() {
//         return z.object({
//             body: this.base,
//         });
//     }

//     public get update() {
//         return z.object({
//             query: this.baseIdQuery,
//             body: this.base.partial(),
//         });
//     }

//     public get getById() {
//         return z.object({
//             query: this.baseIdQuery,
//         });
//     }
// }

// // Export singleton instance
// export const AdminZodSchemaInstance = AdminZodSchema.getInstance();