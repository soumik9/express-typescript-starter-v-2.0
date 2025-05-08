import { Application } from "express";
import { config } from "./config.server";
import { errorLogger, infoLogger } from "../logger";
import { Server } from "http";
import { handleProcessError } from "../errors";
import { shutdownServerGracefully } from "./shutdown.server";
import { conntectToDatabase } from "./database.server";

// **Bootstrap the server and handle errors gracefully
export const bootstrap = async (app: Application): Promise<Server> => {
    // Track server instance for graceful shutdown
    let server: Server;

    try {
        // Handle uncaught exceptions globally (with improved logging)
        process.on('uncaughtException', handleProcessError('uncaughtException'));
        process.on('unhandledRejection', handleProcessError('unhandledRejection'));

        // Handle termination signals for graceful shutdown
        process.on('SIGTERM', () => shutdownServerGracefully(server, 'SIGTERM'));
        process.on('SIGINT', () => shutdownServerGracefully(server, 'SIGINT'));

        // Connect to database before starting server (more reliable approach)
        await conntectToDatabase();

        // Start server after database connection is confirmed
        server = await startServer(app);
        return server;
    } catch (error) {
        errorLogger.error(`Failed to bootstrap application: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
};

// **Start the server and return the server instance
const startServer = (app: Application): Promise<Server> => {
    return new Promise((resolve) => {
        const server = app.listen(config.PORT, () => {
            infoLogger.info(`Server running at http://localhost:${config.PORT}`);
            resolve(server);
        });
    });
};