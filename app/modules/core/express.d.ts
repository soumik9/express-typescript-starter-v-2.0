import express from 'express';
import { Types } from 'mongoose';
import { IUser } from '../user';

declare global {
    namespace Express {
        interface Request {
            user?: Partial<IUser>;
            files?: Express.Multer.File[] | Express.Multer.File;
        }
    }
}