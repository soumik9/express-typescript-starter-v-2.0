import { Server } from "http";
import { errorLogger, httpLogger, infoLogger } from "../logger";
import { disconnectFromDatabase } from "./database.server";
import { ErrorHandlerInstance } from "../errors";


// @server: Register signal handlers for graceful shutdown
export const registerSignalHandlers = (server: Server) => {
    const signals = ['SIGINT', 'SIGTERM'];

    signals.forEach((signal) => {
        process.on(signal, () => shutdownServerGracefully(server, signal));
    });

    process.on('uncaughtException', ErrorHandlerInstance.process('uncaughtException'));
    process.on('unhandledRejection', ErrorHandlerInstance.process('unhandledRejection'));
};

export const shutdownServerGracefully = async (server: Server, signal: string) => {
    infoLogger.info(`${signal} received, starting graceful shutdown`);

    // Add a timeout to force exit if graceful shutdown takes too long
    const forceExit = setTimeout(() => {
        errorLogger.error('Forced exit due to graceful shutdown timeout');
        process.exit(1);
    }, 30000); // 30 seconds timeout

    try {
        // Close the HTTP server first (stop accepting new connections)
        if (server) {
            await new Promise<void>((resolve) => {
                server.close(() => resolve());
            });
            infoLogger.info('HTTP server closed');
        }

        // Use the dedicated database closing function
        await disconnectFromDatabase();

        // Close Redis connection if it exists
        // if (redis) {
        //     await redis.quit();
        //     infoLogger.info('Redis connection closed successfully');
        // }

        clearTimeout(forceExit);
        infoLogger.info('Graceful shutdown completed');
        [infoLogger, httpLogger, errorLogger].forEach((l) => l.close());
        process.exit(0);
    } catch (error) {
        errorLogger.error(`Error during graceful shutdown: ${error instanceof Error ? error.message : String(error)}`);
        clearTimeout(forceExit);
        process.exit(1);
    }
};