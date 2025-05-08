import { errorLogger } from "../logger";
import { config } from "../server";

const handleProcessError = (errorType: string) => (error: Error | any) => {
    errorLogger.error(`${errorType}: ${error instanceof Error ? error.stack || error.message : String(error)}`);

    // Don't exit immediately on uncaught exceptions during development
    if (config.ENV === 'production') {
        process.exit(1);
    }
};

export default handleProcessError;