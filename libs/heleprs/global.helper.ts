import path from "path";
import moment from "moment";
import { errorLogger } from "../../config";
import { IApiReponse } from "../../app/modules";
import { NextFunction, Request, RequestHandler, Response } from "express";

// *Catch async errors
export const catchAsync = (fn: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
            errorLogger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

// *Send response
export const sendResponse = <T>(res: Response, data: IApiReponse<T>): void => {
    const responseData: IApiReponse<T> = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || null || undefined,
        data: data.data || null || undefined,
    };

    res.status(data.statusCode).json(responseData);
};

// *Get request full url
export const getRequestFulllUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

// *Get request base url
export const getRequestBaseUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host');
}

// *Get request path
export const getLocalRootPath = (): string => {
    return process.cwd();
};

// *Get local file path
export const getLocalFilePath = (relativePath: string) => {
    const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(getLocalRootPath(), normalizedPath);
}

// *Get timestamp
export const getCurrentTimestamp = (): string => {
    return moment().utc().format('YYYY-MM-DD HH:mm:ss');
};

// *Get data with pagination
export const getPaginatedData = async (
    queryModel: any, query = {}, page = 1, limit = 10, sort = { createdAt: -1 }, populate = ''
) => {
    // Convert string inputs to numbers if needed
    const currentPage = parseInt(page as any) || 1;
    const pageSize = parseInt(limit as any) || 10;

    // Get total items count
    const totalItems = await queryModel.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // Execute query with pagination parameters
    let dataQuery = queryModel.find(query)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .sort(sort)
        .lean();

    // Apply populate if provided
    if (populate) {
        dataQuery = dataQuery.populate(populate);
    }

    // Get data
    const data = await dataQuery;

    // Calculate pagination flags
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    // Return data and metadata
    return {
        data,
        meta: {
            totalItems,
            totalPages,
            currentPage,
            pageSize,
            hasNextPage,
            hasPreviousPage,
        },
    };
};