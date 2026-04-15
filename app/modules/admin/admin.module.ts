// admin.module.ts
import { Router } from 'express';
import { Admin } from './admin.model';
import { AdminRoutes } from './admin.route';
import { BaseModule } from '../shared/base';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SharedRegistry } from '../shared/registry';

class AdminModule extends BaseModule<AdminController> {

    // Lazy load local service
    private _service?: AdminService;
    public get service(): AdminService {
        if (!this._service) {
            this._service = new AdminService(Admin);
        }
        return this._service;
    }

    // Create Controller
    protected createController(): AdminController {
        return new AdminController(
            this.service,
            SharedRegistry.emailTemplateService
        );
    }

    // Create Router
    protected createRouter(): Router {
        return new AdminRoutes(this.controller).getRouter();
    }
}

export const AdminModuleInstance = new AdminModule();