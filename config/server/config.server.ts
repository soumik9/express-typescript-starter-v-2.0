import { loadEnvironmentVariables, validateEnvVariables } from "../../libs/heleprs";

// Load environment variables before defining config
loadEnvironmentVariables();

// Define required environment variables
const requiredVariables = [
    // 'PORT', 'NODE_ENV', 'BCRYPT_SALT_ROUND',
    'MONGODB_URI', 'MONGODB_DATABASE_NAME',
    'TOKEN_SECRET', 'TOKEN_SECRET_EXP',
    'SEED_ADMIN_PHONE', 'SEED_ADMIN_PASSWORD', 'SEED_ADMIN_ROLE'
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

    MAIL: {
        ID: process.env.EMAIL_ID,
        PASSWORD: process.env.EMAIL_PASSWORD,
        HOSTNAME: process.env.EMAIL_HOST,
        PORT: process.env.EMAIL_PORT,
        NAME: process.env.EMAIL_NAME,
    },

    SEEDER: {
        DEFAULT_ADMIN: {
            PHONE: process.env.SEED_ADMIN_PHONE,
            PASSWORD: process.env.SEED_ADMIN_PASSWORD,
            ROLE: process.env.SEED_ADMIN_ROLE,
        },
    }
};