import { Server } from "http";
import { Application } from "express";
import { errorLogger, infoLogger } from "../logger";
import { config, conntectToDatabase, registerSignalHandlers } from ".";

// @server: Bootstrap the server and handle errors gracefully
export const bootstrap = async (app: Application): Promise<Server> => {
    // Track server instance for graceful shutdown
    let server: Server;
    app.locals.ready = false;

    try {
        // Connect to database before starting server (more reliable approach)
        await conntectToDatabase();

        // Start server after database connection is confirmed
        server = await startServer(app);

        registerSignalHandlers(server);
        app.locals.ready = true;
        return server;
    } catch (error) {
        errorLogger.error(`Failed to bootstrap application: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
};

// @server: Start the server and return the server instance
const startServer = (app: Application): Promise<Server> => {
    return new Promise((resolve) => {
        const server = app.listen(config.PORT, () => {
            infoLogger.info(`Server running at: ${config.URL.BASE}`);
            // seedDefaultAdmin();
            resolve(server);
        });
    });
};