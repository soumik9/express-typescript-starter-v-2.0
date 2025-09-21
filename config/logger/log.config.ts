import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ServerEnvironmentEnum } from "../../libs/enum";

const environment = process.env.NODE_ENV || "development";

/**
 * DailyRotateFile handles daily rotation 
 * 30-day cleanup automatically via maxFiles: "30d"
 */

// @config: Set the log directory
const logDirectory = path.join(process.cwd(), 'logs'); // dont use "getRootPath" function here
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const customColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "cyan",
    verbose: "blue",
    debug: "magenta",
    silly: "gray",
};

const splat = winston.format.splat();
const rawLevel = Symbol.for("level");
const colorizer = winston.format.colorize();
const errorsWithStack = winston.format.errors({
    stack: environment === ServerEnvironmentEnum.Development ? true : false
});

const redactKeys = [
    "password", "pass", "token", "authorization", "apiKey", "x-api-key", "secret", "client_secret"
];

winston.addColors(customColors);

// @service: Timestamp format
const timestampFormat = winston.format.timestamp({
    format: () => new Date().toISOString(),
});

// @service: Redact sensitive information
const redact = winston.format((info) => {
    const mask = (v: any): any => {
        if (!v || typeof v !== "object") return v;
        if (Array.isArray(v)) return v.map(mask);
        const o: Record<string, any> = {};
        for (const [k, val] of Object.entries(v)) {
            if (redactKeys.includes(k.toLowerCase())) o[k] = "[REDACTED]";
            else o[k] = mask(val);
        }
        return o;
    };

    if (typeof info.message === "object") info.message = mask(info.message);
    const { message, level, timestamp, stack, ...rest } = info as any;
    const meta = mask(rest);
    return { message, level, timestamp, stack, ...meta };
});

// @service: console format
const consoleFormat = winston.format.printf((info: any) => {
    const { timestamp, env, logger } = info;
    const raw = (info[rawLevel] || info.level) as string;
    const upper = String(raw).toUpperCase();
    const levelLabel = colorizer.colorize(raw, upper); // colored + UPPERCASE
    const msg = typeof info.message === "object" ? JSON.stringify(info.message) : String(info.message ?? "");
    const metaStr = (env || logger) ? ` ${JSON.stringify({ env, logger })}` : "";
    const stack = info.stack ? `\n${info.stack}` : "";
    return `[${levelLabel}] ${timestamp} | ${msg}${metaStr && Object.keys(metaStr).length
        ? ` | META: ${metaStr}`
        : ""
        }${stack ? `\nSTACK: ${stack}` : ""}`;
});

// @service: Shared transports
const makeConsoleTransport = (level: string) =>
    new winston.transports.Console({
        level,
        format: winston.format.combine(
            timestampFormat,
            errorsWithStack,
            splat,
            redact(),
            consoleFormat
        ),
    });

// @service: Create a rotating file transport
const makeRotateFileTransport = (basename: string, level: string) => {
    const dir = path.join(logDirectory, basename);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });

    return new DailyRotateFile({
        level,
        dirname: dir,
        filename: `%DATE%-${basename}.log`,
        datePattern: "DD-MM-YYYY",
        zippedArchive: true,
        maxSize: "50m",
        maxFiles: "30d",
        auditFile: path.join(dir, `.audit-${basename}.json`),
        createSymlink: true,
        symlinkName: `${basename}.log`,
        format: winston.format.combine(
            timestampFormat,
            errorsWithStack,
            splat,
            redact(),
            consoleFormat
        ),
    });
};

// @config: Custom log format
const createLogger = (level: string, filename: string) => {
    const logger = winston.createLogger({
        level: level,
        levels: winston.config.npm.levels,
        defaultMeta: {
            env: process.env.NODE_ENV || "development",
            logger: filename,
        },
        transports: [
            makeConsoleTransport(level),
            makeRotateFileTransport(filename, level),
        ],
        exitOnError: false,
    });

    return logger;
};

// Create specific loggers
export const infoLogger = createLogger("info", "combined");
export const httpLogger = createLogger("http", "http");
export const errorLogger = createLogger("error", "error");