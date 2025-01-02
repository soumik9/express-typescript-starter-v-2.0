import mongoose from "mongoose"
import { config } from "./config";
import { errorLogger, infoLogger } from "../logger/logConfig";

const database = async () => {
    const uri = `${config.DATABASE.MONGO_URI}/${config.DATABASE.NAME}`;
    try {
        await mongoose.connect(uri, { writeConcern: { w: "majority" }, });
        infoLogger.info("Connected to MongoDB using Mongoose!");
    } catch (error) {
        errorLogger.error(`Error connecting database: ${error instanceof Error ? error.message : 'unknown'}`);
        process.exit(1);
    }
};

export default database;