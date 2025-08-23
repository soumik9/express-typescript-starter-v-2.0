import cors from 'cors'
import moment from 'moment';
import helmet from "helmet";
import { getRequestFulllUrl } from '../../libs/helpers';
import { httpLogger, multerUpload } from '../../config';
import { handleParseRequestBody } from './parser.middleware';
import express, { Application, NextFunction, Request, Response } from 'express';

// @middleware: request Log Middleware
const handleRequestLog = (req: Request, res: Response, next: NextFunction) => {
    const { method } = req;
    const startTime = moment();

    res.on('finish', () => {
        const endTime = moment();
        const duration = endTime.diff(startTime);
        const formattedDuration = moment.duration(duration).asMilliseconds();
        const message = `${method} ${getRequestFulllUrl(req)} ${res.statusCode} - ${formattedDuration}ms`;
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

    // multer configure
    app.use(
        multerUpload.fields([
            { name: "single", maxCount: 1 },
            { name: "multiple", maxCount: 10 },
        ])
    );

    app.use(handleRequestLog);
    app.use(handleParseRequestBody);
};

