import express from 'express'
const router = express.Router();

import { Signin } from './auth.controller';

//routes
router.post('/signin', Signin);

export const AuthRoutes = router;