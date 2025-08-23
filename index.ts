import path from 'path';
import { MainRoutes } from './app/routes';
import { handleRouteNotFound } from './app/modules';
import { bootstrap, handleGlobalErrors } from './config';
import { handleCheckPublicFileExists, serverMiddlewares } from './app/middleware';
import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express';

const app: Application = express();

// Middleware
serverMiddlewares(app);

// files route
app.use('/public', handleCheckPublicFileExists, express.static('public'));

// Welcome route
app.get('/', (req, res) => {
    console.log(req.query);
    const filePath = path.join(process.cwd(), 'public', 'html', 'index.html');
    res.sendFile(filePath);
});

// all routes
app.use('/api/v1', MainRoutes);

// Global error handler (should be before RouteNotFound)
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    handleGlobalErrors(err, req, res, next);
});

// Handle route not found (should be the last middleware)
app.use(handleRouteNotFound);

// Server & database
bootstrap(app);