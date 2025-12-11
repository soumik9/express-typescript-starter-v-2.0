import fs from 'fs';
import path from 'path';
import httpStatus from 'http-status';
import { Application, Request, Response } from 'express';
import { cacheViewerEmailTeamplateStyles } from '../../../../libs/style';
import { ApiError, config, errorLogger, infoLogger } from '../../../../config';
import { EmailTemplateEnum, ServerEnvironmentEnum } from '../../../../libs/enum';
import { ResponseInstance, EmailInstance, ServerUtilityInstance, LocalCache } from '../../../../libs/helper/core';

// @service: home route
export const handleWelcomeRoute = (req: Request, res: Response) => {
    const htmlContent = EmailInstance.renderTemplate({
        templateName: EmailTemplateEnum.Home,
        data: {
            title: "Backend",
            explore_url: "https://soumikahammed.com/",
        }
    });

    res
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .status(httpStatus.OK)
        .send(htmlContent);
}

// @service: Health route
export const handleHealthRoute = (app: Application) => {
    return async (req: Request, res: Response) => {
        const healthData = await ServerUtilityInstance.getHealth(app);

        // Render HTML or JSON
        if (req.query.format === "json") {
            res
                .status(healthData.isReady ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE)
                .json(healthData);
        } else {
            const htmlContent = EmailInstance.renderTemplate({
                templateName: EmailTemplateEnum.Health,
                data: healthData,
            })
            res
                .setHeader("Content-Type", "text/html; charset=utf-8")
                .status(healthData.isReady ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE)
                .send(htmlContent);
        }
    };
};

// @service: not found
export const handleRouteNotFound = (req: Request, res: Response) => {
    const htmlContent = EmailInstance.renderTemplate({
        templateName: EmailTemplateEnum.NotFound,
        data: {
            original_url: req.originalUrl,
            full_url: ServerUtilityInstance.url(req),
        }
    });

    res
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .status(httpStatus.NOT_FOUND)
        .send(htmlContent);
};

// @service: generate module
export const handleGenerateModule = ResponseInstance.catchAsync(
    async (req: Request, res: Response) => {
        if (config.ENV !== ServerEnvironmentEnum.Development)
            throw new ApiError(httpStatus.FORBIDDEN, "You can not access this endpoint.");

        const { folder_name, prefix, panel } = req.query as { [key: string]: string };

        if (!folder_name || !prefix) {
            ResponseInstance.error(res, {
                statusCode: httpStatus.BAD_REQUEST,
                message: "Please provide folder name and prefix",
                errorMessages: [],
            });
        }

        // Determine base modules directory
        let baseDir: string;
        switch (panel) {
            case "admin":
                baseDir = path.join(process.cwd(), "app", "modules", "admin_panel");
                break;
            case "app":
                baseDir = path.join(process.cwd(), "app", "modules", "app_panel");
                break;
            default:
                return ResponseInstance.error(res, {
                    statusCode: httpStatus.BAD_REQUEST,
                    message: "Invalid panel type. Must be 'admin' or 'app'.",
                    errorMessages: [],
                });
        }

        // Target module folder
        const folderPath = path.join(baseDir, String(folder_name));
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            infoLogger.info(`📁 Created module folder: ${folderPath}`);
        }

        // Files to create
        const files = [
            "controller", "route", "interface", "model", "zod", "dto", "service",
        ].map((suffix) => `${prefix}.${suffix}.ts`);
        files.push("index.ts");

        // File creation helper
        const created: string[] = [];
        const skipped: string[] = [];

        files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, `// ${file}\n`, "utf8");
                infoLogger.info(`✅ Created: ${filePath}`);
                created.push(file);
            } else {
                errorLogger.error(`⚠️ Already exists: ${filePath}`);
                skipped.push(file);
            }
        });

        return ResponseInstance.success(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Module files generated successfully",
            data: {
                folder_path: folderPath,
                created_files: created,
                skipped_files: skipped,
            }
        });
    }
);

// local cache test route
export const handleLocalCache = ResponseInstance.catchAsync(
    async (req: Request, res: Response) => {

        // Restrict access in non-development environments
        if (config.ENV !== ServerEnvironmentEnum.Development) {
            const { key } = req.query;
            if (key !== config.KEY.CACHE_API_AUTHORIZED) {
                throw new ApiError(httpStatus.FORBIDDEN, "You can not access this endpoint.");
            }
        }

        const result = LocalCache.getAll();

        // Convert the cache object into an array of {key, value} for easier iteration in Handlebars
        const cacheEntries = Object.entries(result).map(([key, value]) => ({
            key,
            value: JSON.stringify(value, null, 2)
        }));

        const htmlContent = EmailInstance.renderTemplate({
            templateName: EmailTemplateEnum.CacheViewer,
            data: {
                title: "Cache Viewer",
                cacheEntries: cacheEntries,
                styles: cacheViewerEmailTeamplateStyles,
            },
            useCache: false,
        });

        res
            .setHeader("Content-Type", "text/html; charset=utf-8")
            .status(httpStatus.OK)
            .send(htmlContent);
    }
);