import express from 'express'
const router = express.Router();

import AuthController from '../controller/AuthController';

//routes
router.post(
    '/signin',
    AuthController.Signin
);

export const AuthRoutes = router;