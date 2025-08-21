import { loadEnvironmentVariables, validateEnvVariables } from "../../libs/helpers/env.helper";

// Load environment variables before defining config
loadEnvironmentVariables();

// Define required environment variables
const requiredVariables = [
    // 'PORT', 'NODE_ENV', 'BCRYPT_SALT_ROUND',
    "BASE_URL", "CLIENT_BASE_URL",
    'MONGODB_URI', 'MONGODB_DATABASE_NAME',
    'TOKEN_SECRET', 'TOKEN_SECRET_EXP',
    'DEFAULT_ADMIN_PHONE', 'DEFAULT_ADMIN_PASSWORD', 'DEFAULT_ADMIN_ROLE'
];

// Validate environment variables
validateEnvVariables(requiredVariables);

// Export the environment variables
export const config = {
    PORT: process.env.PORT,
    ENV: process.env.NODE_ENV || 'development',
    TOKEN: {
        SECRET: process.env.TOKEN_SECRET,
        EXPIRES_IN: process.env.TOKEN_SECRET_EXP,
    },
    BCRYPT: {
        SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
    },
    DATABASE: {
        MONGO_URI: process.env.MONGODB_URI,
        NAME: process.env.MONGODB_DATABASE_NAME,
    },

    URL: {
        BASE: process.env.BASE_URL,
        CLIENT: process.env.CLIENT_BASE_URL,
    },

    MAIL: {
        ID: process.env.EMAIL_ID,
        PASSWORD: process.env.EMAIL_PASSWORD,
        HOSTNAME: process.env.EMAIL_HOST,
        PORT: process.env.EMAIL_PORT,
        NAME: process.env.EMAIL_NAME,
        FROM: process.env.EMAIL_FROM,
    },

    SEEDER: {
        DEFAULT_ADMIN: {
            PHONE: process.env.DEFAULT_ADMIN_PHONE,
            PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
            ROLE: process.env.DEFAULT_ADMIN_ROLE,
        },
    }
};