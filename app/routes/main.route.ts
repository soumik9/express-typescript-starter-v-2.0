// app/routes/index.ts
import { Router } from 'express';
import { AdminModuleInstance } from '../modules';

class MainRouter {
    private readonly router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes(): void {
        const apiRoutes: any[] = [
            { path: "/admin", route: AdminModuleInstance.router },
        ];

        apiRoutes.forEach((route) => {
            this.router.use(route.path, route.route);
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const MainRoutesInstance = new MainRouter();