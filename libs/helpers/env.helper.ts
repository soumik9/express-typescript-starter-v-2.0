import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
import { ZodObject } from "zod";

/**
 * dont use errorLogger here, because it may not be defined yet
 * dont use from config env file, because it may not be defined yet
 */

// @desc: Load environment variables from .env files based on the current environment
export const loadEnvironmentVariables = (): void => {

    // Load the default .env file first to initialize NODE_ENV
    const defaultEnvPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(defaultEnvPath)) {
        dotenv.config({ path: defaultEnvPath });
        console.log('Loaded default environment configuration from .env');
    }

    // Now determine the NODE_ENV value (default to 'development' if not set)
    const NODE_ENV = process.env.NODE_ENV || 'development';

    // Determine which env file to use based on environment
    const envFiles = {
        production: '.env.production',
        staging: '.env.staging',
        development: '.env.local',
        test: '.env.test',
    };

    const envFile = envFiles[NODE_ENV as keyof typeof envFiles] || '.env.local';
    const envPath = path.join(process.cwd(), envFile);

    // Check if the environment-specific file exists
    if (!fs.existsSync(envPath)) {
        if (fs.existsSync(defaultEnvPath))
            console.warn(`Environment file ${envFile} not found, using default .env file`);
        else
            console.warn(`No environment files found. Using process.env values only.`);
    } else {
        dotenv.config({ path: envPath }); // Load the environment-specific file
        console.log(`Loaded environment configuration from ${envFile}`);
    }
};

// @helper: Validate required environment variables
export const validateEnvVariables = (schema: ZodObject): any => {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
        const error = `Invalid environment variables: ${parsed.error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join(', ')}`;
        throw new Error(error);
    }

    return parsed.data;
};
