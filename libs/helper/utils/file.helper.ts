import path from "path";
import { defaultImagePath } from "../../constant";
import { FnFileReturnTypeEnum } from "../../enum";
import { IUploadFile } from "../../../app/modules";
import { promises as fsPromises, existsSync, mkdirSync } from "fs";
import { config, errorLogger, infoLogger } from "../../../config";

class FileService {
    private static instance: FileService;

    private constructor() { }

    /** Singleton accessor */
    public static getInstance(): FileService {
        if (!FileService.instance) {
            FileService.instance = new FileService();
        }
        return FileService.instance;
    }

    /** Move single/multiple files into target folder */
    public async move(
        sourcePaths: string | string[],
        destinationFolder: string
    ): Promise<string | string[]> {

        const paths = Array.isArray(sourcePaths) ? sourcePaths : [sourcePaths];
        const isMultiple = Array.isArray(sourcePaths);

        try {
            const publicBasePath = path.join(process.cwd(), "public");
            const targetDirectory = path.join(publicBasePath, destinationFolder);

            if (!existsSync(targetDirectory)) {
                mkdirSync(targetDirectory, { recursive: true });
            }

            const results = await Promise.all(
                paths.map(async (filePath) => {
                    const fileName = path.basename(filePath);
                    const destinationPath = path.join(targetDirectory, fileName);
                    const publicUrl = `public/${destinationFolder}/${fileName}`;

                    await fsPromises.rename(filePath, destinationPath);
                    infoLogger.info(
                        `File moved to: ${destinationPath}, public URL: ${publicUrl}`
                    );

                    return publicUrl;
                })
            );

            if (!results.length || !results[0]) {
                return isMultiple ? [] : "";
            }

            return isMultiple ? results : results[0];
        } catch (err) {
            const errMsg = `Error moving file(s): ${err instanceof Error ? err.message : err}`;
            errorLogger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    /** Extract full paths from multer upload result */
    public extractPaths<T extends FnFileReturnTypeEnum.Single | FnFileReturnTypeEnum.Multiple>(
        files: any,
        type: T
    ): Promise<T extends FnFileReturnTypeEnum.Single ? string | undefined : string[]> {
        if (!files || Object.keys(files).length === 0) {
            return Promise.resolve(
                type === FnFileReturnTypeEnum.Single ? undefined : []
            ) as any;
        }

        if (type === FnFileReturnTypeEnum.Single) {
            if (Array.isArray(files)) return Promise.resolve(files[0]?.path) as any;
            if (files.single && Array.isArray(files.single)) {
                return Promise.resolve(files.single[0]?.path) as any;
            }
            return Promise.resolve(undefined) as any;
        }

        if (files.multiple && Array.isArray(files.multiple)) {
            return Promise.resolve(
                files.multiple.map((file: IUploadFile) => file.path)
            ) as any;
        }

        return Promise.resolve([]) as any;
    }

    /** Delete single or multiple files */
    public async delete(filePaths: string | string[]): Promise<void> {
        const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
        if (paths.length === 0) return;

        await Promise.all(
            paths.map(async (file) => {
                try {
                    await fsPromises.unlink(file);
                    infoLogger.info(`File deleted: ${file}`);
                } catch (err) {
                    const code = (err as NodeJS.ErrnoException).code;
                    const isNotFound = code === "ENOENT";
                    const logger = isNotFound ? errorLogger.warn : errorLogger.error;
                    const msg = isNotFound
                        ? `File not found: ${file}`
                        : `Failed to delete file: ${file} - ${(err as Error).message}`;

                    logger(msg);
                }
            })
        );
    }

    /** Build full URLs for documents */
    public getFullUrl<T extends FnFileReturnTypeEnum>(
        paths: T extends FnFileReturnTypeEnum.Single
            ? string | undefined
            : string[] | undefined,
        type: T
    ): T extends FnFileReturnTypeEnum.Single ? string : string[] {

        const baseUrl = config.URL.BASE;
        const fallback = `${baseUrl}/${defaultImagePath}`;

        if (type === FnFileReturnTypeEnum.Single) {
            if (!paths) return fallback as any;

            const pathStr = paths as string;
            return `${baseUrl}/${pathStr}` as any;
        }

        if (!Array.isArray(paths)) {
            return [fallback] as any;
        }

        return paths.map((p) => `${baseUrl}/${p}`) as any;
    }
}

// Export singleton
export const FileInstance = FileService.getInstance();
