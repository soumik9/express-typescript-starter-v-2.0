// home.controller.ts
import fs from "fs";
import path from "path";
import httpStatus from "http-status";
import { Application, Request, Response } from "express";
import { cacheViewerEmailTeamplateStyles } from "../../../../libs/style";
import { ApiError, config, errorLogger, infoLogger } from "../../../../config";
import { EmailTemplateEnum, ServerEnvironmentEnum } from "../../../../libs/enum";
import { ResponseInstance, EmailInstance, ServerUtilityInstance, LocalCache } from "../../../../libs/helper/core";

class CoreService {
    private static instance: CoreService;

    private constructor() { }

    public static getInstance(): CoreService {
        if (!CoreService.instance) {
            CoreService.instance = new CoreService();
        }
        return CoreService.instance;
    }

    /**
     * GET /
     */
    public welcome(req: Request, res: Response) {
        const htmlContent = EmailInstance.renderTemplate({
            templateName: EmailTemplateEnum.Home,
            data: {
                title: "Backend",
                explore_url: "https://soumikahammed.com/",
            },
        });

        res
            .setHeader("Content-Type", "text/html; charset=utf-8")
            .status(httpStatus.OK)
            .send(htmlContent);
    }

    /**
     * GET /health
     */
    public health(app: Application): any {
        return async (req: Request, res: Response) => {
            const healthData = await ServerUtilityInstance.getHealth(app);

            if (req.query.format === "json") {
                return res
                    .status(healthData.isReady ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE)
                    .json(healthData);
            }

            const htmlContent = EmailInstance.renderTemplate({
                templateName: EmailTemplateEnum.Health,
                data: healthData,
            });

            res
                .setHeader("Content-Type", "text/html; charset=utf-8")
                .status(healthData.isReady ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE)
                .send(htmlContent);
        };
    }

    /**
     * Not Found Handler
     */
    public notFound(req: Request, res: Response) {
        const htmlContent = EmailInstance.renderTemplate({
            templateName: EmailTemplateEnum.NotFound,
            data: {
                original_url: req.originalUrl,
                full_url: ServerUtilityInstance.url(req),
            },
        });

        res
            .setHeader("Content-Type", "text/html; charset=utf-8")
            .status(httpStatus.NOT_FOUND)
            .send(htmlContent);
    }

    /**
     * Module Generator (DEV ONLY)
     */
    public generateModule = ResponseInstance.catchAsync(
        async (req: Request, res: Response) => {
            if (config.ENV !== ServerEnvironmentEnum.Development)
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    "You can not access this endpoint."
                );

            const { folder_name, prefix, panel } = req.query as {
                [key: string]: string;
            };

            if (!folder_name || !prefix) {
                return ResponseInstance.error(res, {
                    statusCode: httpStatus.BAD_REQUEST,
                    message: "Please provide folder name and prefix",
                    errorMessages: [],
                });
            }

            // base directory
            let baseDir: string;
            switch (panel) {
                case "admin":
                    baseDir = path.join(
                        process.cwd(),
                        "app",
                        "modules",
                        "admin_panel"
                    );
                    break;

                case "app":
                    baseDir = path.join(
                        process.cwd(),
                        "app",
                        "modules",
                        "app_panel"
                    );
                    break;

                default:
                    return ResponseInstance.error(res, {
                        statusCode: httpStatus.BAD_REQUEST,
                        message:
                            "Invalid panel type. Must be 'admin' or 'app'.",
                        errorMessages: [],
                    });
            }

            const folderPath = path.join(baseDir, String(folder_name));

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                infoLogger.info(`📁 Created module folder: ${folderPath}`);
            }

            const files = [
                "controller",
                "route",
                "interface",
                "model",
                "zod",
                "dto",
                "service",
            ].map((suffix) => `${prefix}.${suffix}.ts`);

            files.push("index.ts");

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
                },
            });
        }
    );

    /**
     * Local Cache Viewer
     */
    public localCache = ResponseInstance.catchAsync(
        async (req: Request, res: Response) => {
            if (config.ENV !== ServerEnvironmentEnum.Development) {
                const { key } = req.query;
                if (key !== config.KEY.CACHE_API_AUTHORIZED) {
                    throw new ApiError(
                        httpStatus.FORBIDDEN,
                        "You can not access this endpoint."
                    );
                }
            }

            const result = LocalCache.getAll();

            const cacheEntries = Object.entries(result).map(
                ([key, value]) => ({
                    key,
                    value: JSON.stringify(value, null, 2),
                })
            );

            const htmlContent = EmailInstance.renderTemplate({
                templateName: EmailTemplateEnum.CacheViewer,
                data: {
                    title: "Cache Viewer",
                    cacheEntries,
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
}

// Export singleton
export const CoreServiceInstance = CoreService.getInstance();