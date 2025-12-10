// import { z } from "zod";
// import { PhoneCountryZodSchema } from "../../shared";
// import { zodPreprocess } from "../../../../libs/helper";
// import { AdminRoleEnum } from "../../../../libs/enums";

// // Base Admin Zod Schema (for creation)
// const BaseAdminZodSchema = z.object({
//     name: zodPreprocess(
//         "", z.string().nonempty({ message: "Name field is required" })
//     ),

//     email: zodPreprocess(
//         "", z.email({ message: "Invalid email address" }).nonempty({ message: "Email field is required" })
//     ),

//     phone: zodPreprocess(
//         "", z.string().nonempty({ message: "Phone field is required" })
//     ),

//     country: zodPreprocess(
//         "",
//         PhoneCountryZodSchema
//     ),

//     password: zodPreprocess(
//         undefined, z.string().min(6, { message: "Password must be at least 6 characters long" }).optional()
//     ),

//     role: zodPreprocess(
//         "",
//         z.string().refine(
//             val => Object.values(AdminRoleEnum).includes(val as AdminRoleEnum),
//             { message: `Role must be one of: ${Object.values(AdminRoleEnum).join(", ")}` }
//         )
//     ),
// });

// const BaseAdminIdQuery = z.object({
//     admin_id: zodPreprocess("", z
//         .string()
//         .nonempty({ message: "Query: Admin ID is required" }),
//     ),
// });

// /**
//  * ============================
//  */

// // UserAdmin Create Zod Schema
// export const AdminCreateZodSchema = z.object({ body: BaseAdminZodSchema });

// // UserAdmin Update Schema (all fields optional)
// export const AdminUpdateZodSchema = z.object({
//     query: BaseAdminIdQuery,
//     body: BaseAdminZodSchema.partial(),
// });

// // Query schema for a single Admin
// export const SingleAdminQueryZodSchema = z.object({
//     query: BaseAdminIdQuery,
// });