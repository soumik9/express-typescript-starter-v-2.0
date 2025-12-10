import express, { Router } from 'express';

const router = express.Router();

const apiRoutes: { path: string, route: Router }[] = [
    // {
    //     path: '/auth',
    //     route: AuthRoutes,
    // },
    // {
    //     path: '/user',
    //     route: UserRoutes,
    // },
];

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;