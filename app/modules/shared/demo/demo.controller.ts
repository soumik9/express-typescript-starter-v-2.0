// @controller: get all data with pagination & filter
// export const GetFilteredPaginateAdmins: RequestHandler = catchAsync(
//     async (req: Request, res: Response) => {

//         let result = null;
//         const { page, limit } = handleParseQuery(req.query);
//         const cacheKey = `${AdminCacheKeyEnum.AllPaginatedFiltered}${page}-${limit}`;

//         const cachedAdmins = LocalCache.get<IRedisMultipleReturn<IAdmin[]>>(cacheKey);
//         if (cachedAdmins) {
//             result = cachedAdmins;
//         } else {
//             result = await getPaginatedData<IAdmin[]>({
//                 model: Admin, query: {}, page, limit
//             });
//             result = {
//                 ...result,
//                 data: result.data?.map((admin: IAdmin) => new AdminDtoResponse(admin)),
//             };
//             LocalCache.set([{ key: cacheKey, value: result }]);
//         }

//         sendSuccessResponse<IAdmin[]>(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             message: 'Admins retrieved successfully!',
//             meta: result.meta,
//             data: result.data || [],
//         });
//     }
// );