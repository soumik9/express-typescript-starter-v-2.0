import { MainRoutes } from './app/routes';
import express, { Application } from 'express';
import { CoreServiceInstance } from './app/modules';
import { GlobalErrorInstance, ServerBootstrapInstance } from './config';
import { handleCheckPublicFileExists, serverMiddlewares } from './app/middleware';

const app: Application = express();

// Middleware
serverMiddlewares(app);

// files route
app.use('/public', handleCheckPublicFileExists, express.static('public'));

// Welcome route
app.get("/", CoreServiceInstance.welcome);
app.get("/healthz", CoreServiceInstance.health(app));
app.get("/generate-module", CoreServiceInstance.generateModule);

app.get("/local-cache", CoreServiceInstance.localCache);

// all routes
app.use('/api/v1', MainRoutes);

// Global error handler (should be before RouteNotFound)
app.use(GlobalErrorInstance.handler());

// Handle route not found (should be the last middleware)
app.use(CoreServiceInstance.notFound);

// Server & database
ServerBootstrapInstance.bootstrap(app);