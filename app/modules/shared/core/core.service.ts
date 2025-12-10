import fs from 'fs';
import path from 'path';
import httpStatus from 'http-status';
import { Application, Request, Response } from 'express';
import { ApiError, config, errorLogger, infoLogger } from '../../../../config';
import { EmailTemplateEnum, ServerEnvironmentEnum } from '../../../../libs/enum';
import { catchAsync, getRequestFulllUrl, getServerHealth, renderTemplate, sendErrorResponse, sendSuccessResponse } from '../../../../libs/helper';

// @service: home route
export const handleWelcomeRoute = (req: Request, res: Response) => {
    const htmlContent = renderTemplate(EmailTemplateEnum.Home, {
        title: "Backend",
        explore_url: "https://soumikahammed.com/",
    });

    res
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .status(httpStatus.OK)
        .send(htmlContent);
}

// @service: Health route
export const handleHealthRoute = (app: Application) => {
    return (req: Request, res: Response) => {
        const healthData = getServerHealth(app);

        // Render HTML or JSON
        if (req.query.format === "json") {
            res
                .status(healthData.isReady ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE)
                .json(healthData);
        } else {
            const htmlContent = renderTemplate(EmailTemplateEnum.Health, healthData);
            res
                .setHeader("Content-Type", "text/html; charset=utf-8")
                .status(healthData.isReady ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE)
                .send(htmlContent);
        }
    };
};

// @service: not found
export const handleRouteNotFound = (req: Request, res: Response) => {
    const htmlContent = renderTemplate(EmailTemplateEnum.NotFound, {
        original_url: req.originalUrl,
        full_url: getRequestFulllUrl(req),
    });

    res
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .status(httpStatus.NOT_FOUND)
        .send(htmlContent);
};

// @service: generate module
export const handleGenerateModule = catchAsync(
    async (req: Request, res: Response) => {
        if (config.ENV !== ServerEnvironmentEnum.Development)
            throw new ApiError(httpStatus.FORBIDDEN, "You can not access this endpoint.");

        const { folder_name, prefix, panel } = req.query as { [key: string]: string };

        if (!folder_name || !prefix) {
            sendErrorResponse(res, {
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
                return sendErrorResponse(res, {
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

        return sendSuccessResponse(res, {
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