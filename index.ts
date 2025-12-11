import { MainRoutes } from './app/routes';
import express, { Application } from 'express';
import { GlobalErrorInstance, ServerBootstrapInstance } from './config';
import { handleCheckPublicFileExists, serverMiddlewares } from './app/middleware';
import { handleGenerateModule, handleHealthRoute, handleLocalCache, handleRouteNotFound, handleWelcomeRoute } from './app/modules';

const app: Application = express();

// Middleware
serverMiddlewares(app);

// files route
app.use('/public', handleCheckPublicFileExists, express.static('public'));

// Welcome route
app.get("/", handleWelcomeRoute);
app.get("/healthz", handleHealthRoute(app));
app.get("/generate-module", handleGenerateModule);

app.get("/local-cache", handleLocalCache);

// all routes
app.use('/api/v1', MainRoutes);

// Global error handler (should be before RouteNotFound)
app.use(GlobalErrorInstance.handler());

// Handle route not found (should be the last middleware)
app.use(handleRouteNotFound);

// Server & database
ServerBootstrapInstance.bootstrap(app);