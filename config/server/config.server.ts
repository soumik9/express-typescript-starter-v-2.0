import { loadEnvironmentVariables, validateEnvVariables } from "../../libs/heleprs";

// Load environment variables before defining config
loadEnvironmentVariables();

// Define required environment variables
const requiredVariables = [
    'PORT', 'NODE_ENV', 'BASE_URL', 'CLIENT_BASE_URL',
    'MONGODB_URI', 'MONGODB_DATABASE_NAME', 'DEFAULT_ADMIN_PASSWORD', 'DEFAULT_ADMIN_EMAIL',
    'BCRYPT_SALT_ROUND', 'TOKEN_SECRET', 'TOKEN_SECRET_EXPIRES_IN',
    'EMAIL_ID', 'EMAIL_PASSWORD', 'EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_NAME',
];

// Validate environment variables
validateEnvVariables(requiredVariables);

// Export the environment variables
export const config = {
    PORT: process.env.PORT,
    ENV: process.env.NODE_ENV || 'development',
    TOKEN: {
        SECRET: process.env.TOKEN_SECRET,
        EXPIRES_IN: process.env.TOKEN_SECRET_EXPIRES_IN,
    },
    BCRYPT: {
        SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
    },
    DATABASE: {
        MONGO_URI: process.env.MONGODB_URI,
        NAME: process.env.MONGODB_DATABASE_NAME,
    },
    MAIL: {
        ID: process.env.EMAIL_ID,
        PASSWORD: process.env.EMAIL_PASSWORD,
        HOSTNAME: process.env.EMAIL_HOST,
        PORT: process.env.EMAIL_PORT,
        NAME: process.env.EMAIL_NAME,
    },

    URL: {
        BASE: process.env.BASE_URL,
        CLIENT: process.env.CLIENT_BASE_URL,
    },

    SEEDER: {
        DEFAULT_ADMIN: {
            EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
            PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
        },
    }
};