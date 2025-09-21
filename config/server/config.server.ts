import z from "zod";
import { loadEnvironmentVariables, validateEnvVariables } from "../../libs/helper/core/env.helper";

// Load environment variables before defining config
loadEnvironmentVariables();

// Define required environment variables
const EnvSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production']).default('development'),
    PORT: z
        .string()
        .nonempty({ message: "PORT is required." }),

    TOKEN_SECRET: z
        .string()
        .nonempty({ message: "Token secret is required." }),
    TOKEN_SECRET_EXP: z
        .string()
        .nonempty({ message: "Token secret expiration is required." }),

    BCRYPT_SALT_ROUND: z
        .string()
        .nonempty({ message: "Bcrypt salt round is required." }),


    MONGODB_URI: z
        .string()
        .nonempty({ message: "Mongo URI is required." }),

    MONGODB_DATABASE_NAME: z
        .string()
        .nonempty({ message: "MongoDB database name is required." }),

    BASE_URL: z
        .string()
        .nonempty({ message: "Base URL is required." }),
    CLIENT_BASE_URL: z
        .string()
        .nonempty({ message: "Client base URL is required." }),

    DEFAULT_ADMIN_PHONE: z
        .string()
        .nonempty({ message: "Default admin phone is required." }),
    DEFAULT_ADMIN_PASSWORD: z
        .string()
        .nonempty({ message: "Default admin password is required." }),
    DEFAULT_ADMIN_ROLE: z
        .string()
        .nonempty({ message: "Default admin role is required." }),

    EMAIL_ID: z
        .string()
        .nonempty({ message: "Email ID is required." }),
    EMAIL_PASSWORD: z
        .string()
        .nonempty({ message: "Email password is required." }),
    EMAIL_HOST: z
        .string()
        .nonempty({ message: "Email host is required." }),
    EMAIL_PORT: z
        .string()
        .nonempty({ message: "Email port is required." }),
    EMAIL_NAME: z
        .string()
        .nonempty({ message: "Email name is required." }),
    EMAIL_FROM: z
        .string()
        .nonempty({ message: "Email from address is required." })
});

// Validate environment variables
const parsedConfig = validateEnvVariables(EnvSchema);

// Export the environment variables
export const config = {
    PORT: parsedConfig.PORT,
    ENV: parsedConfig.NODE_ENV || 'development',
    TOKEN: {
        SECRET: parsedConfig.TOKEN_SECRET,
        EXPIRES_IN: parsedConfig.TOKEN_SECRET_EXP,
    },
    BCRYPT: {
        SALT_ROUND: parsedConfig.BCRYPT_SALT_ROUND,
    },
    DATABASE: {
        MONGO_URI: parsedConfig.MONGODB_URI,
        NAME: parsedConfig.MONGODB_DATABASE_NAME,
    },

    URL: {
        BASE: parsedConfig.BASE_URL,
        CLIENT: parsedConfig.CLIENT_BASE_URL,
    },

    MAIL: {
        ID: parsedConfig.EMAIL_ID,
        PASSWORD: parsedConfig.EMAIL_PASSWORD,
        HOSTNAME: parsedConfig.EMAIL_HOST,
        PORT: parsedConfig.EMAIL_PORT,
        NAME: parsedConfig.EMAIL_NAME,
        FROM: parsedConfig.EMAIL_FROM,
    },

    SEEDER: {
        DEFAULT_ADMIN: {
            PHONE: parsedConfig.DEFAULT_ADMIN_PHONE,
            PASSWORD: parsedConfig.DEFAULT_ADMIN_PASSWORD,
            ROLE: parsedConfig.DEFAULT_ADMIN_ROLE,
        },
    }
};