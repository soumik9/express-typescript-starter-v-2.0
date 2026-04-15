// admin.route.ts
import { Router } from 'express';
import { AdminController } from './admin.controller';
import { AdminZodSchemaInstance } from './admin.zod';
import { ZodInstance } from '../../../libs/helper/utils';
import { AuthMiddlewareInstance } from '../../middleware';
import { AdminRoleEnum, PassportKeyEnum } from '../../../libs/enum';

export class AdminRoutes {
    public readonly router: Router;

    constructor(
        private readonly controller: AdminController
    ) {
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get(
            '/',
            AuthMiddlewareInstance.verify(
                [PassportKeyEnum.AdminAuth],
                AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin
            ),
            this.controller.getFilteredPaginated
        );

        this.router.get(
            '/single',
            AuthMiddlewareInstance.verify(
                [PassportKeyEnum.AdminAuth],
                AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin
            ),
            ZodInstance.validateRequest(AdminZodSchemaInstance.getById),
            this.controller.getSingle
        );

        this.router.post(
            '/create',
            AuthMiddlewareInstance.verify(
                [PassportKeyEnum.AdminAuth],
                AdminRoleEnum.SuperAdmin,
            ),
            ZodInstance.validateRequest(AdminZodSchemaInstance.create),
            this.controller.createSingle
        );

        this.router.patch(
            '/update',
            AuthMiddlewareInstance.verify(
                [PassportKeyEnum.AdminAuth],
                AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin
            ),
            ZodInstance.validateRequest(AdminZodSchemaInstance.update),
            this.controller.updateSingle
        );

        this.router.patch(
            '/update/profile',
            AuthMiddlewareInstance.verify(
                [PassportKeyEnum.AdminAuth],
                AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin
            ),
            this.controller.updateSelf
        );

        this.router.delete(
            '/delete',
            AuthMiddlewareInstance.verify(
                [PassportKeyEnum.AdminAuth],
                AdminRoleEnum.SuperAdmin, AdminRoleEnum.Admin
            ),
            ZodInstance.validateRequest(AdminZodSchemaInstance.getById),
            this.controller.deleteSingle
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}