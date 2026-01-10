// // admin.module.ts
// import { Router } from 'express';
// import { Admin } from './admin.model';
// import { AdminRoutes } from './admin.route';
// import { SharedRegistry } from '../../shared';
// import { AdminService } from './admin.service';
// import { AdminController } from './admin.controller';

// class AdminModule {

//     public readonly router: Router;

//     public readonly adminService: AdminService;
//     public readonly adminController: AdminController;

//     constructor() {
//         // Create services
//         this.adminService = new AdminService(Admin);

//         // Create controllers and inject services
//         this.adminController = new AdminController(
//             this.adminService,
//             SharedRegistry.emailTemplateService
//         );

//         // Create routes and inject controllers
//         this.router = new AdminRoutes(this.adminController).getRouter();
//     }
// }

// // business.module.ts
// export const AdminModuleInstance = new AdminModule();