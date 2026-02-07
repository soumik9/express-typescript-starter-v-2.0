import express from 'express';
import { Types } from 'mongoose';
import { IUser } from '../../user';

declare global {
    namespace Express {
        interface Admin {
            _id: string;
            name: string;
            email: string;
            role: string;
        }

        interface Request {
            files?: Express.Multer.File[] | Express.Multer.File;
            admin?: Admin;
        }
    }
}