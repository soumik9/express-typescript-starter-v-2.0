import express from 'express'
import { GetUserById } from './user.controller';
const router = express.Router();

//routes
router.get('/find', GetUserById);

export const UserRoutes = router;