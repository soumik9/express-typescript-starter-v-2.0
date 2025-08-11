import fs from "fs";
import path from "path";
import winston from "winston";

// *Set the log directory
const logDirectory = path.join(process.cwd(), 'logs'); // dont use "getRootPath" function here

// *Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// *Custom log colors
const customColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "cyan",
    verbose: "blue",
    debug: "magenta",
    silly: "gray",
};

winston.addColors(customColors);

// helper to create "date 11.8.2025---11.00AM"
const customTimestamp = () => {
    const now = new Date();
    const d = now.getDate();              // no leading zero
    const m = now.getMonth() + 1;         // no leading zero
    const y = now.getFullYear();

    let h = now.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;                  // 12-hour clock
    const mm = String(now.getMinutes()).padStart(2, "0");

    return `${d}.${m}.${y} --- ${h}.${mm}${ampm}`;
};

// *Custom log format
const createLogger = (level: string, filename: string) => {
    const logger = winston.createLogger({
        level: level,
        format: winston.format.combine(
            winston.format.timestamp({ format: customTimestamp }),
            winston.format.printf(({ level, message, timestamp }) => {
                let formattedMessage = `${timestamp} - `;
                if (level) {
                    formattedMessage += `[${level.toUpperCase()}] `;
                }
                formattedMessage +=
                    typeof message === "object"
                        ? JSON.stringify(message, null, 2)
                        : message;
                return formattedMessage;
            })
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize({ all: true }),
                    winston.format.simple()
                ),
            }),
            new winston.transports.File({
                filename: path.join(logDirectory, filename),
                level: level,
            }),
        ],
    });

    return logger;
};

// Create specific loggers
export const infoLogger = createLogger("info", "combined.log");
export const httpLogger = createLogger("http", "http.log");
export const errorLogger = createLogger("error", "error.log");