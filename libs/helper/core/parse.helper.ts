// services/QueryParser.service.ts
export interface IParsedQuery {
    page: number;
    limit: number;
    [key: string]: string | number | null;
}

class ParserService {
    private static instance: ParserService;

    private constructor() { }

    /** Singleton accessor */
    public static getInstance(): ParserService {
        if (!ParserService.instance) {
            ParserService.instance = new ParserService();
        }
        return ParserService.instance;
    }

    /**
     * Parse query parameters with pagination and optional string fields
     * @param query Express request query object
     */
    public parse(query: Record<string, any>): IParsedQuery {
        // Default pagination
        const page = query.page ? parseInt(query.page as string, 10) : 1;
        const limit = query.limit ? parseInt(query.limit as string, 10) : 999999;

        // Optional string keys that should always be string
        const stringKeys = ["admin_id"];
        const extra: Record<string, string> = {};

        stringKeys.forEach((key) => {
            extra[key] = query[key] ? query[key].toString() : "";
        });

        return {
            page,
            limit,
            ...extra,
        };
    }
}

// Export singleton instance
export const ParserInstance = ParserService.getInstance();
