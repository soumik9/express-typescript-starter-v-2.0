import fs from "fs";
import path from "path";
import dotenv from 'dotenv';

/**
 * dont use errorLogger here, because it may not be defined yet
 * dont use from config env file, because it may not be defined yet
 */

// @helper: Load environment variables from .env files based on the current environment
export const loadEnvironmentVariables = (): void => {
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

    // Check if the environment file exists
    if (!fs.existsSync(envPath)) {
        const defaultEnvPath = path.join(process.cwd(), '.env');

        // Fall back to default .env if specific environment file doesn't exist
        if (fs.existsSync(defaultEnvPath)) {  // Fixed: using fs.existsSync instead of fstat.existsSync
            dotenv.config({ path: defaultEnvPath });
            console.warn(`Environment file ${envFile} not found, using default .env file`);
        } else {
            console.warn(`No environment files found. Using process.env values only.`);
        }
    } else {
        // Load the environment-specific file
        dotenv.config({ path: envPath });
        console.log(`Loaded environment configuration from ${envFile}`);
    }
};

// @helper: Validate required environment variables
export const validateEnvVariables = (requiredVars: string[]): void => {
    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        const error = `Missing required environment variables: ${missing.join(', ')}`;

        // Use the safe logging function instead of potentially undefined errorLogger
        console.log('error', error);

        // Only throw in development to avoid exposing details in production
        if (process.env.NODE_ENV !== 'production') {
            throw new Error(error);
        }
    }
};
