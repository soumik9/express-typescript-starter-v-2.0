import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import path from 'path';
import cors from 'cors'
import helmet from "helmet";
// @ts-ignore
import xss from 'xss-clean';
import sanitize from 'express-mongo-sanitize';
import bootstrap from './config/server/bootstrap';
import upload from './config/multer/multerConfig';
import requestLogger from './config/logger/requestLogger';
import handleGlobalErrors from './config/errors/handleGlobalErrors';
import router from './app/routes/routes';
import handleRouteNotFound from './app/routes/handleRouteNotFound';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(sanitize());
app.use(xss());
app.use(helmet());
app.use(requestLogger);

// multer configure
app.use(
    upload.fields([
        { name: "single", maxCount: 1 },
        { name: "multiple", maxCount: 10 },
    ])
);

// files route
app.use('/public', express.static('public'));

// Welcome route
app.get('/', (req, res) => {
    const filePath = path.join(process.cwd(), 'public', 'html', 'index.html');
    res.sendFile(filePath);
});

// all routes
app.use('/api/v1', router);

// Global error handler (should be before RouteNotFound)
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    handleGlobalErrors(err, req, res, next);
});

// Handle route not found (should be the last middleware)
app.use(handleRouteNotFound);

// Server & database
bootstrap(app);