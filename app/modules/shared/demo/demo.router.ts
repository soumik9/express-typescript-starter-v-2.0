// import express from 'express'
// const router = express.Router();

// import { AdminRoleEnum } from '../../../../libs/enums';
// import { adminAuthMiddleware, zodRequestValidator } from '../../../middleware';
// import { AdminCreateZodSchema, AdminUpdateZodSchema, SingleAdminQueryZodSchema } from './admin.zod';
// import { CreateSingleAdmin, DeleteSingleAdmin, GetFilteredPaginateAdmins, GetSingleAdmin, UpdateSingleAdmin, UpdateAdminOwnProfile } from './admin.controller';

// //routes
// router.get(
//     '/',
//     adminAuthMiddleware(AdminRoleEnum.Admin),
//     GetFilteredPaginateAdmins
// );

// router.get(
//     '/single',
//     adminAuthMiddleware(AdminRoleEnum.Admin),
//     zodRequestValidator(SingleAdminQueryZodSchema),
//     GetSingleAdmin
// );

// router.post(
//     '/create',
//     adminAuthMiddleware(AdminRoleEnum.Admin),
//     zodRequestValidator(AdminCreateZodSchema),
//     CreateSingleAdmin
// );

// router.patch(
//     '/update',
//     adminAuthMiddleware(AdminRoleEnum.Admin),
//     zodRequestValidator(AdminUpdateZodSchema),
//     UpdateSingleAdmin
// );

// router.delete(
//     '/delete',
//     adminAuthMiddleware(AdminRoleEnum.Admin),
//     zodRequestValidator(SingleAdminQueryZodSchema),
//     DeleteSingleAdmin
// );

// export const AdminRoutes = router;