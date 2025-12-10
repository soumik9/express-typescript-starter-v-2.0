import z from "zod";
import { ServerEnvironmentEnum } from "../../libs/enum";
import { EnvServiceInstance } from "../../libs/helper";

// Load env
EnvServiceInstance.load();

const requiredString = (msg: string) => z.string().nonempty({ error: msg });
const requiredNumber = (msg: string) => z.string().nonempty({ error: msg }).transform((v) => Number(v));

// Define required environment variables
const EnvSchema = z.object({
    NODE_ENV: z.enum(Object.values(ServerEnvironmentEnum)).default(ServerEnvironmentEnum.Development),
    PORT: requiredString("PORT is required."),

    // Token
    TOKEN_SECRET: requiredString("Token secret is required."),
    TOKEN_SECRET_EXPIRES_IN: requiredString("Token secret expiration is required."),

    // Hashing
    BCRYPT_SALT_ROUND: requiredNumber("Bcrypt salt round is required."),

    // Database
    MONGODB_URI: requiredString("Mongo URI is required."),
    MONGODB_DATABASE_NAME: requiredString("MongoDB database name is required."),

    // URLs
    BASE_URL: requiredString("Base URL is required."),
    CLIENT_BASE_URL: requiredString("Client base URL is required."),

    // Default Admin
    DEFAULT_ADMIN_EMAIL: requiredString("Default admin email is required."),
    DEFAULT_ADMIN_PASSWORD: requiredString("Default admin password is required."),
    DEFAULT_ADMIN_ROLE: requiredString("Default admin role is required."),

    // Mail
    EMAIL_ID: requiredString("Email ID is required."),
    EMAIL_PASSWORD: requiredString("Email password is required."),
    EMAIL_HOST: requiredString("Email host is required."),
    EMAIL_PORT: requiredNumber("Email port is required."),
    EMAIL_NAME: requiredString("Email name is required."),
    EMAIL_FROM: requiredString("Email from address is required."),

    CACHE_API_AUTHORIZED_KEY: requiredString("Cache API authorized key is required."),
});

// Validate environment variables
const parsedConfig = EnvServiceInstance.validate(EnvSchema);

// Export the environment variables
export const config = {
    PORT: parsedConfig.PORT,
    ENV: parsedConfig.NODE_ENV || 'development',
    TOKEN: {
        SECRET: parsedConfig.TOKEN_SECRET,
        EXPIRES_IN: parsedConfig.TOKEN_SECRET_EXPIRES_IN,
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
            EMAIL: parsedConfig.DEFAULT_ADMIN_EMAIL,
            PASSWORD: parsedConfig.DEFAULT_ADMIN_PASSWORD,
            ROLE: parsedConfig.DEFAULT_ADMIN_ROLE,
        },
    },

    KEY: {
        CACHE_API_AUTHORIZED: parsedConfig.CACHE_API_AUTHORIZED,
    },
};