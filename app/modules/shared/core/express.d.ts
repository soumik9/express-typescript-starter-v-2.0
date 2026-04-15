import express from 'express';
import { Types } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            files?: Express.Multer.File[] | Express.Multer.File;
            entity?: any;
        }
    }
}