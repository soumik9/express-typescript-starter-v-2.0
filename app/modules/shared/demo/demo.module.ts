// // merchant.module.ts
// import { Router } from 'express';
// import { BaseModule } from '../../shared';
// import { Merchant } from './merchant.model';
// import { MerchantRoutes } from './merchant.route';
// import { MerchantService } from './merchant.service';
// import { MerchantController } from './merchant.controller';

// class MerchantModule extends BaseModule<MerchantController> {

//     // Lazy load local service
//     private _service?: MerchantService;
//     public get service(): MerchantService {
//         if (!this._service) {
//             this._service = new MerchantService(Merchant);
//         }
//         return this._service;
//     }

//     // Create Controller
//     protected createController(): MerchantController {
//         return new MerchantController(
//             this.service
//         );
//     }

//     // Create Router
//     protected createRouter(): Router {
//         return new MerchantRoutes(this.controller).getRouter();
//     }
// }

// export const MerchantModuleInstance = new MerchantModule();