import os from "os";
import path from "path";
import moment from "moment";
import { Application, Request } from "express";
import { getDatabaseInfo } from "../../../config";

// @helper: Get request full url
export const getRequestFulllUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

// @helper: Get request base url
export const getRequestBaseUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host');
}

// @helper: Get request path
export const getLocalRootPath = (): string => {
    return process.cwd();
};

// @helper: Get local file path
export const getLocalFilePath = (relativePath: string) => {
    const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(getLocalRootPath(), normalizedPath);
}

// @helper: get health details
export const getServerHealth = (app: Application) => {

    // Compute service metrics
    const uptimeInSeconds = Math.floor(process.uptime());
    const formatTime = (value: number) => String(value).padStart(2, "0");
    const uptimeFormatted = (() => {
        const hours = Math.floor(uptimeInSeconds / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        const seconds = uptimeInSeconds % 60;
        return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    })();

    const memoryUsage = process.memoryUsage();
    const rssMB = (memoryUsage.rss / 1024 / 1024).toFixed(1);
    const heapUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(1);
    const heapTotalMB = (memoryUsage.heapTotal / 1024 / 1024).toFixed(1);

    const loadAverages = os.loadavg()
        .map((n) => n.toFixed(2))
        .join(" / ");

    // Database and readiness
    const dbInfo = getDatabaseInfo({ username: "healthcheck" });
    const isReady = app.locals.ready === true;

    return {
        uptime: uptimeFormatted,
        timestampUtc: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
        processId: process.pid,
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        rssMB,
        heapUsedMB,
        heapTotalMB,
        loadAverages,
        platform: `${os.platform()} ${os.release()} (${os.arch()})`,
        cpuCores: os.cpus().length,
        isReady,
        statusText: isReady ? "Ready" : "Not Ready",
        statusColor: isReady ? "#16a34a" : "#dc2626",
        isDbConnected: dbInfo.state === "connected",
    };
};