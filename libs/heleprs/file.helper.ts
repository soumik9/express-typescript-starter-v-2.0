import path from "path";
import { IUploadFile } from '../../app/modules';
import { config, errorLogger, infoLogger } from '../../config';
import { promises as fsPromises, existsSync, mkdirSync } from 'fs';
import { FnFileReturnTypeEnum } from "../enums";
import { defaultImagePath } from "../constant";

// *moveFilesToSpecificFolder function
export const moveFilesToSpecificFolder = async (sourcePaths: string | string[], destinationFolder: string): Promise<string | string[]> => {
    try {
        // Normalize inputs
        const paths = Array.isArray(sourcePaths) ? sourcePaths : [sourcePaths];
        const isMultiple = Array.isArray(sourcePaths);

        // Set up destination directory
        const publicBasePath = path.join(process.cwd(), 'public');
        const targetDirectory = path.join(publicBasePath, destinationFolder);

        // Ensure destination directory exists
        if (!existsSync(targetDirectory)) {
            mkdirSync(targetDirectory, { recursive: true });
        }

        // Process all files in parallel
        const results = await Promise.all(paths.map(async (filePath) => {
            const fileName = path.basename(filePath);
            const destinationPath = path.join(targetDirectory, fileName);
            const publicUrl = `public/${destinationFolder}/${fileName}`;

            await fsPromises.rename(filePath, destinationPath);
            infoLogger.info(`File moved to: ${destinationPath}, public URL: ${publicUrl}`);

            return publicUrl;
        }));

        // Return single result or array based on input type
        return isMultiple ? results : results[0];
    } catch (error) {
        const errorMessage = `Error moving file(s): ${error instanceof Error ? error.message : String(error)}`;
        errorLogger.error(errorMessage);
        throw new Error(errorMessage);
    }
};

/**
    const singleUrl = await moveFiles('/tmp/uploads/image.jpg', 'images/profile');
    // Returns: "public/images/profile/image.jpg"

    const multipleUrls = await moveFiles(
    ['/tmp/uploads/image1.jpg', '/tmp/uploads/image2.jpg'],
    'images/gallery'
    );
    // Returns: ["public/images/gallery/image1.jpg", "public/images/gallery/image2.jpg"]
 */

// *extractFilePaths function
export const extractFilePaths = async <T extends FnFileReturnTypeEnum.Single | FnFileReturnTypeEnum.Multiple>(
    files: any, type: T
): Promise<T extends 'single' ? string | undefined : string[]> => {
    // Early return for empty files object
    if (!files || Object.keys(files).length === 0) {
        return (type === 'single' ? undefined : []) as any;
    }

    // Handle single file extraction
    if (type === 'single') {
        // Array of files case
        if (Array.isArray(files)) {
            return files[0]?.path as any;
        }
        // Object with 'single' property case
        else if (files.single && Array.isArray(files.single)) {
            return files.single[0]?.path as any;
        }
        return undefined as any;
    }

    // Handle multiple files extraction
    else {
        // If files.multiple exists and is an array
        if (files.multiple && Array.isArray(files.multiple)) {
            return files.multiple.map((file: IUploadFile) => file.path) as any;
        }
        return [] as any;
    }
};

/**
    const singlePath = await extractFilePaths(files, 'single');
    // Returns: string | undefined

    const multiplePaths = await extractFilePaths(files, 'multiple');
    // Returns: string[]
 */

// *deleteFileFromLocal function
export const deleteFileFromLocal = async (filePaths: string | string[]): Promise<void> => {

    // Normalize input to array
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

    if (paths.length === 0) return;

    // Process all files in parallel
    await Promise.all(paths.map(async (path) => {
        try {
            await fsPromises.unlink(path);
            infoLogger.info(`File deleted: ${path}`);
        } catch (error) {
            // Different logging based on error type
            const isNotFound = (error as NodeJS.ErrnoException).code === 'ENOENT';
            const logFn = isNotFound ? errorLogger.warn : errorLogger.error;
            const message = isNotFound ? `File not found: ${path}` : `Failed to delete file: ${path} - ${(error as Error).message}`;

            logFn(message);
        }
    }));
};

/**
     // Single file
    await deleteFile('/path/to/file.jpg');

    // Multiple files
    await deleteFile([
    '/path/to/file1.jpg',
    '/path/to/file2.pdf'
    ]);
 */

// *Get documents full path
export const getDocumentsFullPath = <T extends FnFileReturnTypeEnum>(
    paths: T extends FnFileReturnTypeEnum.Single ? string | undefined : string[] | undefined, type: T
): T extends FnFileReturnTypeEnum.Single ? string : string[] => {

    const baseUrl = config.URL.BASE;
    const defaultUrl: string = `${config.URL.BASE}/${defaultImagePath}`;

    if (type === FnFileReturnTypeEnum.Single) {
        if (!paths) {
            return defaultUrl as any;
        }

        // For single type, ensure paths is a string
        const path = paths as string;
        return `${baseUrl}/${path}` as any;
    } else {
        // For multiple type, ensure paths is an array
        if (!Array.isArray(paths)) {
            return [defaultUrl] as any;
        }
        const pathArray = Array.isArray(paths) ? paths : [paths as string];
        return pathArray.map(path => `${baseUrl}/${path}`) as any;
    }
};