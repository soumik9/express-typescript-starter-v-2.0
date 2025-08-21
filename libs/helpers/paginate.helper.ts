import { IApiResponseMeta } from "../../app/modules/common";

interface IPaginatedProp {
    model: any;
    query?: Record<string, any>;
    page?: number | string;
    limit?: number | string;
    sort?: Record<string, any>;
    populate?: string | Record<string, any>;
}

// @helper: Get data with pagination
export const getPaginatedData = async <T>({
    model, query = {}, page = 1, limit = 10, sort = { created_at: -1 }, populate = ''
}: IPaginatedProp): Promise<{ data: T, meta: IApiResponseMeta }> => {

    // Convert string inputs to numbers if needed
    const currentPage = parseInt(page as any) || 1;
    const pageSize = parseInt(limit as any) || 10;

    // Get total items count
    const totalItems = await model.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // Execute query with pagination parameters
    let dataQuery = model.find(query)
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
            total_items: totalItems,
            total_pages: totalPages,
            current_page: currentPage,
            page_size: pageSize,
            has_next_page: hasNextPage,
            has_previous_page: hasPreviousPage,
        },
    };
};

// @helper: Manual pagination
export const getManualPaginatedData = <T>(data: T[], page = 1, limit = 10) => {
    // Convert string inputs to numbers if needed
    const currentPage = parseInt(page as any) || 1;
    const pageSize = parseInt(limit as any) || 10;

    // Calculate total items and total pages
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Slice the array for the current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    // Calculate pagination flags
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    // Return paginated data and metadata
    return {
        data: paginatedData,
        meta: {
            total_items: totalItems,
            total_pages: totalPages,
            current_page: currentPage,
            page_size: pageSize,
            has_next_page: hasNextPage,
            has_previous_page: hasPreviousPage,
        },
    };
};