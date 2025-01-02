import express, { Router } from 'express';
import { AuthRoutes } from './AuthRoutes';

const router = express.Router();

const apiRoutes: { path: string, route: Router }[] = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
];

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;