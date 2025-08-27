import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { bootstrap, handleGlobalErrors } from './config';
import { handleCheckPublicFileExists, serverMiddlewares } from './app/middleware';
import { MainRoutes } from './app/routes';
import { handleHealthRoute, handleRouteNotFound, handleWelcomeRoute } from './app/modules';

const app: Application = express();

// Middleware
serverMiddlewares(app);

// files route
app.use('/public', handleCheckPublicFileExists, express.static('public'));

// stat route
app.get("/", handleWelcomeRoute);
app.get("/healthz", handleHealthRoute(app));

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