import { Application } from "express";
import { errorLogger, infoLogger } from "../logger/logConfig";
import { config } from "./config";
import database from "./database";

// server related works
process.on('uncaughtException', (error) => {
    errorLogger.error(`Error uncaught exception server: ${error.message}`);
    process.exit(1);
});

// server listener
const bootstrap = async (app: Application) => {
    try {
        app.listen(config.PORT, () => {
            infoLogger.info(`Listening on port http://localhost:${config.PORT}`);

            // connect database after server started
            database()
        });
    } catch (error) {
        errorLogger.error(`Error creating server: ${error instanceof Error ? error.message : 'unknown'}`);
        process.exit(1);
    }
}

export default bootstrap;