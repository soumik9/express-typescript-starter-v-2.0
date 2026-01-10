// // customer.route.ts
// import { Router } from 'express';
// import { AdminController } from './admin.controller';
// import { AdminZodSchemaInstance } from './admin.zod';
// import { AdminRoleEnum } from '../../../../libs/enum';
// import { ZodInstance } from '../../../../libs/helper';
// import { AuthMiddlewareInstance } from '../../../middleware';

// export class AdminRoutes {
//     public readonly router: Router;

//     constructor(
//         private readonly adminController: AdminController
//     ) {
//         this.router = Router();
//         this.registerRoutes();
//     }

//     private registerRoutes(): void {
//         this.router.get(
//             '/',
//             AuthMiddlewareInstance.admin(AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin),
//             this.adminController.getFilteredPaginated
//         );

//         this.router.get(
//             '/single',
//             AuthMiddlewareInstance.admin(AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin),
//             ZodInstance.validateRequest(AdminZodSchemaInstance.getById),
//             this.adminController.getSingle
//         );

//         this.router.post(
//             '/create',
//             AuthMiddlewareInstance.admin(AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin),
//             ZodInstance.validateRequest(AdminZodSchemaInstance.create),
//             this.adminController.createSingle
//         );

//         this.router.patch(
//             '/update',
//             AuthMiddlewareInstance.admin(AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin),
//             ZodInstance.validateRequest(AdminZodSchemaInstance.update),
//             this.adminController.updateSingle
//         );

//         this.router.patch(
//             '/update-own-profile',
//             AuthMiddlewareInstance.admin(AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin, AdminRoleEnum.Manager, AdminRoleEnum.CustomerManager, AdminRoleEnum.SalesManager),
//             this.adminController.updateSingleOwnProfile
//         );


//         this.router.delete(
//             '/delete',
//             AuthMiddlewareInstance.admin(AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin),
//             ZodInstance.validateRequest(AdminZodSchemaInstance.getById),
//             this.adminController.deleteSingle
//         );
//     }

//     public getRouter(): Router {
//         return this.router;
//     }
// }