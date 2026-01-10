// import { IAdmin } from ".";
// import validator from "validator";
// import { NextFunction } from 'connect';
// import { Schema, model } from 'mongoose';
// import { CommonSchema } from "../../shared";
// import { AdminRoleEnum } from '../../../../libs/enums';
// import { generateHash } from '../../../../libs/helper';

// const AdminSchema = new Schema<IAdmin>({
//     admin_id: {
//         type: String,
//         required: [true, 'Admin ID field is required'],
//         unique: true,
//         trim: true,
//     },
//     name: {
//         type: String,
//         required: [true, 'First Name field is required']
//     },
//     image: String,
//     email: {
//         type: String,
//         required: [true, 'Email field is required'],
//         unique: true,
//         validate: [validator.isEmail, 'Please provide a valid email.'],
//     },
//     phone: {
//         type: String,
//         required: [true, 'Phone field is required']
//     },
//     country: {
//         code: {
//             type: String,
//             required: [true, 'Country code is required'],
//         },
//         name: {
//             type: String,
//             required: [true, 'Country name is required'],
//         },
//         dial_code: {
//             type: String,
//             required: [true, 'Country dial code is required'],
//         },
//     },
//     password: {
//         type: String,
//         // required: [true, 'Password field is required'],
//         minlength: [6, 'Password must be at least 6 characters long'],
//     },
//     role: {
//         type: String,
//         enum: {
//             values: Object.values(AdminRoleEnum),
//             message: '{VALUE} is not supported, must be one of ' + Object.values(AdminRoleEnum).join(', '),
//         },
//         required: [true, 'Role field is required'],
//     },
//     is_blocked: {
//         type: Boolean,
//         default: false,
//     },
// });

// // Inherit from CommonSchema
// AdminSchema.add(CommonSchema);

// // create or save works for both
// AdminSchema.pre("save", async function (next: NextFunction) {
//     if (!this.isModified("password")) {
//         return next();
//     }

//     const password = this.password;
//     const hashedPassword = await generateHash(String(password));
//     this.password = hashedPassword;
//     next();
// });

// auto generate sequential uid
// AdminSchema.plugin(sequentialIdPlugin, {
//     prefix: PrefixItemEnum.Admin,
//     fieldName: "admin_id",
//     includeYear: true,
//     digitLength: 4,
//     useCurrentYear: true
// });

// export const Admin = model<IAdmin>("Admin", AdminSchema);