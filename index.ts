import { MainRoutes } from './app/routes';
import express, { Application } from 'express';
import { CoreServiceInstance } from './app/modules';
import { FileInstance } from './libs/helper'; // dont up the file
import { serverMiddlewares } from './app/middleware';
import { GlobalErrorInstance, ServerBootstrapInstance } from './config';

const app: Application = express();

// Middleware
serverMiddlewares(app);

// files route
app.use('/public', FileInstance.exists, express.static('public'));

// basic routes
app.get("/", CoreServiceInstance.welcome);
app.get("/healthz", CoreServiceInstance.health(app));
app.get("/generate-module", CoreServiceInstance.generateModule);
app.get("/local-cache", CoreServiceInstance.localCache);

// all routes
app.use('/api/v1', MainRoutes);

// error / not found handlers
app.use(GlobalErrorInstance.handler());
app.use(CoreServiceInstance.notFound);

// Server & database
ServerBootstrapInstance.bootstrap(app);