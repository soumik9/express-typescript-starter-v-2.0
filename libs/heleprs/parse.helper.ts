// @helper: parseQueryData function
export const handleParseQuery = (query: any): {
    page: number; limit: number;
    [key: string]: string | number;
} => {

    //pagination
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 999999;

    const status = query.status ? query.status.toString() : null;
    const search = query.search ? query.search.toString() : null;

    return {
        page,
        limit,

        status,
        search
    }
}