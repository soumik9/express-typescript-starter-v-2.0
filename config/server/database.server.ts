import mongoose from "mongoose"
import { config } from "./config.server";
import { errorLogger, infoLogger } from "../logger/log.config";

// @server: Connect to MongoDB using Mongoose
export const conntectToDatabase = async () => {
    const uri = `${config.DATABASE.MONGO_URI}/${config.DATABASE.NAME}`;
    try {
        await mongoose.connect(uri, { writeConcern: { w: "majority" }, });

        // Set up connection event listeners
        mongoose.connection.on('error', (err) => errorLogger.error(`MongoDB connection error: ${err}`));
        mongoose.connection.on('disconnected', () => infoLogger.warn(`MongoDB disconnected: ${config.DATABASE.NAME}`));
        mongoose.connection.on('reconnected', () => infoLogger.info(`MongoDB reconnected: ${config.DATABASE.NAME}`));

        infoLogger.info(`Connected to MongoDB: ${config.DATABASE.NAME}`);
        return mongoose.connection;
    } catch (error) {
        errorLogger.error(`Database connection failed: ${error instanceof Error ? error.message : 'unknown'}`);
        throw error; // Let the caller handle process exit if needed
    }
};

// @server: Disconnect from MongoDB using Mongoose
export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        if (mongoose.connection.readyState === 1) { // 1 = connected
            await mongoose.connection.close();
            infoLogger.info("MongoDB connection closed gracefully");
        } else
            infoLogger.info("No active MongoDB connection to close");
    } catch (error) {
        errorLogger.error(`Error closing database connection: ${error instanceof Error ? error.message : String(error)}`);
        throw error; // Propagate error for handling in the calling function
    }
};

// @server: Get current connection state as a readable string
export const getConnectionStateName = (): string => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    };
    return states[mongoose.connection.readyState] || 'unknown';
};

// @server: Get current database connection information
export const getDatabaseInfo = ({ username = '' }): Record<string, any> => {
    const connection = mongoose.connection;
    return {
        state: getConnectionStateName(),
        database: connection.db?.databaseName || config.DATABASE.NAME,
        host: connection.host || 'N/A',
        collections: Object.keys(connection.collections).length,
        models: Object.keys(mongoose.models).length,
        user: username,
        timestamp: new Date().toISOString()
    };
};