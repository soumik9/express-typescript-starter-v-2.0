import cors from 'cors'
import moment from 'moment';
import helmet from "helmet";
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { handleParseRequestBody } from './parser.middleware';
import express, { Application, NextFunction, Request, Response } from 'express';
import { config, errorLogger, handleFileCompression, httpLogger, multerUpload } from '../../config';
import { PassportKeyEnum } from '../../libs/enum';
import { passportJwtVerify } from '../../libs/helper';

// @middleware: request Log Middleware
const handleRequestLog = (req: Request, res: Response, next: NextFunction) => {
    const { method } = req;
    const startTime = moment();

    res.on('finish', () => {
        const endTime = moment();
        const duration = endTime.diff(startTime);
        const formattedDuration = moment.duration(duration).asMilliseconds();
        const message = `${method} ${config.URL.BASE + req.originalUrl} ${res.statusCode} - ${formattedDuration}ms`;
        httpLogger.http(message);
    });

    next();
};

export const serverMiddlewares = (app: Application) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));

    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));

    // Add global compression middleware after multer
    app.use(async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.files && Object.keys(req.files).length > 0) {
                await handleFileCompression(req.files as any);
            }
            next();
        } catch (err) {
            errorLogger.error(`Global file compression error: ${err instanceof Error ? err.message : String(err)}`);
            next(err);
        }
    });


    // multer configure
    app.use(
        multerUpload.fields([
            { name: "single", maxCount: 1 },
            { name: "multiple", maxCount: 10 },
        ])
    );

    app.use(handleRequestLog);
    app.use(handleParseRequestBody);

    passport.use(PassportKeyEnum.JwtAuth, new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.TOKEN.SECRET,
    }, passportJwtVerify));

    app.use(passport.initialize());
};