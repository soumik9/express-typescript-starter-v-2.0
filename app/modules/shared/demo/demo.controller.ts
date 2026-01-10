// // country.controller.ts
// import httpStatus from "http-status";
// import { fileMappings } from "../../../../libs/constant";
// import { ApiError, config, errorLogger } from "../../../../config";
// import { Request, RequestHandler, Response } from "express";
// import { EmailTeamplateService, ICommonDoc, IRedisMultipleReturn } from "../../shared";
// import { FileInstance, LocalCache, ParserInstance, RandomInstance, ResponseInstance, SecurityInstance } from "../../../../libs/helper";
// import { AdminCacheKeyEnum, CountryCacheKeyEnum, DocumentFolderEnum, FnFileReturnTypeEnum, RegionCacheKeyEnum } from "../../../../libs/enum";
// import { AdminService } from "./admin.service";
// import { IAdmin } from "./admin.interface";

// export class AdminController {
//     constructor(
//         private readonly adminService: AdminService,
//         private readonly emailTemplateService: EmailTeamplateService,
//     ) { }

//     // get data with pagination & filter
//     public readonly getFilteredPaginated: RequestHandler = ResponseInstance.catchAsync(
//         async (req: Request, res: Response) => {

//             let result = null;
//             const { page, limit } = ParserInstance.query(req.query);

//             const cacheKey = `${AdminCacheKeyEnum.AllPaginatedFiltered}${page}-${limit}`;
//             const cachedAdmins = LocalCache.get<IRedisMultipleReturn<IAdmin[]>>(cacheKey);

//             if (cachedAdmins)
//                 result = cachedAdmins;
//             else {
//                 result = await this.adminService.getFilteredPaginated({
//                     page,
//                     limit,
//                     query: {},
//                     filterWithDto: true,
//                 });
//                 LocalCache.set([{ key: cacheKey, value: result }]);
//             }

//             ResponseInstance.success<IAdmin[]>(res, {
//                 statusCode: httpStatus.OK,
//                 success: true,
//                 message: 'Admins retrieved successfully!',
//                 meta: result.meta || null,
//                 data: result.data || [],
//             });
//         }
//     );

//     // get single data by id
//     public readonly getSingle: RequestHandler = ResponseInstance.catchAsync(
//         async (req: Request, res: Response) => {

//             const { admin_id } = ParserInstance.query(req.query);

//             const result = await this.adminService.findOrThrow({
//                 query: {
//                     _id: admin_id,
//                 },
//                 isItemShouldExist: true,
//                 filterWithDto: true,
//             });

//             ResponseInstance.success<IAdmin>(res, {
//                 statusCode: httpStatus.OK,
//                 success: true,
//                 message: "Admin fetched successfully!",
//                 data: result,
//             });
//         }
//     );

//     // create single data
//     public readonly createSingle: RequestHandler = ResponseInstance.catchAsync(
//         async (req: Request, res: Response) => {

//             const body = req.body;

//             // check conflict
//             await this.adminService.findOrThrow({
//                 query: {
//                     email: body.email,
//                 },
//                 isItemShouldExist: true,
//                 filterWithDto: false,
//                 isConflicted: true,
//                 conflictMessage: 'Admin with same email already exists!',
//             });

//             const randomPassword = RandomInstance.generatePassword(6);

//             // create country
//             const result = await this.adminService.createOne({
//                 data: {
//                     ...body,
//                     password: randomPassword,
//                 }
//             })

//             if (result) {
//                 this.emailTemplateService.sendAdminInvite({
//                     email: result.email,
//                     name: result.name,
//                     randomPassword,
//                 });

//                 // Invalidate ALL paginated/filtered admin cache
//                 LocalCache.invalidate([
//                     `${AdminCacheKeyEnum.AllPaginatedFiltered}`
//                 ]);
//             }
//             ResponseInstance.success<IAdmin>(res, {
//                 statusCode: httpStatus.OK,
//                 success: true,
//                 message: "Admin created successfully!",
//                 data: result,
//             });
//         }
//     );

//     // update single data
//     public readonly updateSingle: RequestHandler = ResponseInstance.catchAsync(
//         async (req: Request, res: Response) => {

//             const body = req.body;
//             const { admin_id: query_admin_id } = ParserInstance.query(req.query);
//             const { email, password, admin_id, ...data } = body; // remove email, password from data

//             // file uploads
//             const uploadedFile = req.files ? await FileInstance.paths(req.files, FnFileReturnTypeEnum.Single) : null;

//             // check for existing country with same code
//             const admin = await this.adminService.findOrThrow({
//                 query: {
//                     _id: query_admin_id,
//                 },
//                 isItemShouldExist: true,
//                 filterWithDto: false,
//             });

//             // can't update default admin
//             if (admin.email === config.SEEDER.DEFAULT_ADMIN.EMAIL)
//                 throw new ApiError(httpStatus.BAD_REQUEST, 'You can not update this admin!');

//             try {
//                 // 1. if profile image is provided
//                 if (uploadedFile) {
//                     const destinationFolder = `${DocumentFolderEnum.Admin}/${req.admin?.role}/${query_admin_id}`;
//                     const doc = await FileInstance.move(uploadedFile, destinationFolder) as ICommonDoc;
//                     data.image = doc.path;
//                 }

//                 // Update data
//                 const result = await this.adminService.updateOne({
//                     query: { _id: query_admin_id },
//                     data,
//                     filterWithDto: true,
//                 });

//                 // Step 4: Remove old image if update is successful
//                 if (result && req.files && Object.keys(req.files).length > 0 && admin.image)
//                     await FileInstance.delete(admin.image);

//                 // Invalidate ALL paginated/filtered admin cache
//                 LocalCache.invalidate([
//                     `${AdminCacheKeyEnum.AllPaginatedFiltered}`
//                 ]);

//                 ResponseInstance.success<IAdmin>(res, {
//                     statusCode: httpStatus.OK,
//                     success: true,
//                     message: "Admin updated successfully!",
//                     data: result,
//                 });
//             } catch (error) {
//                 // Rollback newly uploaded files if error occurs
//                 if (uploadedFile && uploadedFile.path)
//                     await FileInstance.delete(uploadedFile.path);

//                 errorLogger.error(`Error in update admin controller: ${error instanceof Error ? error.message : error}`);
//                 throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update admin!');
//             }
//         }
//     );

//     // update single data
//     public readonly updateSingleOwnProfile: RequestHandler = ResponseInstance.catchAsync(
//         async (req: Request, res: Response) => {

//             const body = req.body;
//             const requester_id = req.admin?._id;
//             const { email, role, admin_id, ...data } = body; // remove email and role from data

//             // file uploads
//             const uploadedFile = req.files ? await FileInstance.paths(req.files, FnFileReturnTypeEnum.Single) : null;

//             // check for existing country with same code
//             const admin = await this.adminService.findOrThrow({
//                 query: {
//                     _id: requester_id,
//                 },
//                 isItemShouldExist: true,
//                 filterWithDto: false,
//             });

//             try {
//                 // 1. if profile image is provided
//                 if (uploadedFile) {
//                     const destinationFolder = `${DocumentFolderEnum.Admin}/${req.admin?.role}/${requester_id}`;
//                     const doc = await FileInstance.move(uploadedFile, destinationFolder) as ICommonDoc;
//                     data.image = doc.path;
//                 }

//                 // Step 2: Handle password update
//                 if (data.current_password && data.new_password && admin.password) {
//                     // Validate current password
//                     const isMatched = await SecurityInstance.compareHash(data.current_password, admin.password);
//                     if (!isMatched)
//                         throw new ApiError(httpStatus.BAD_REQUEST, 'Your current password is incorrect!');

//                     // Validate password length
//                     if (data.new_password.length < 6)
//                         throw new ApiError(httpStatus.BAD_REQUEST, `Password must be at least 6 characters long`);

//                     // Update password
//                     data.password = await SecurityInstance.generateHash(data.new_password);
//                 }

//                 // Update data
//                 const result = await this.adminService.updateOne({
//                     query: { _id: requester_id },
//                     data,
//                     filterWithDto: true,
//                 });

//                 // Step 4: Remove old image if update is successful
//                 if (result && req.files && Object.keys(req.files).length > 0 && admin.image && admin.image !== uploadedFile?.path)
//                     await FileInstance.delete(admin.image);

//                 // Invalidate ALL paginated/filtered admin cache
//                 LocalCache.invalidate([
//                     `${AdminCacheKeyEnum.AllPaginatedFiltered}`
//                 ]);

//                 ResponseInstance.success<IAdmin>(res, {
//                     statusCode: httpStatus.OK,
//                     success: true,
//                     message: "Profile updated successfully!",
//                     data: result,
//                 });
//             } catch (error) {
//                 // Rollback newly uploaded files if error occurs
//                 if (uploadedFile && uploadedFile.path)
//                     await FileInstance.delete(uploadedFile.path);

//                 errorLogger.error(`Error in update own profile controller: ${error instanceof Error ? error.message : error}`);
//                 throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update own profile!');
//             }
//         }
//     );

//     // delete single data
//     public readonly deleteSingle: RequestHandler = ResponseInstance.catchAsync(
//         async (req: Request, res: Response) => {

//             const { admin_id } = ParserInstance.query(req.query);

//             // check for existing country with same code
//             const admin = await this.adminService.findOrThrow({
//                 query: {
//                     _id: admin_id,
//                 },
//                 isItemShouldExist: true,
//                 filterWithDto: false,
//             });

//             // can't delete default admin
//             if (admin.email === config.SEEDER.DEFAULT_ADMIN.EMAIL)
//                 throw new ApiError(httpStatus.BAD_REQUEST, 'You can not delete this admin!');

//             await this.adminService.deleteOne({ _id: admin_id });

//             // Invalidate ALL paginated/filtered admin cache
//             LocalCache.invalidate([
//                 `${AdminCacheKeyEnum.AllPaginatedFiltered}`
//             ]);

//             ResponseInstance.success<{ deleted_item_id: string }>(res, {
//                 statusCode: httpStatus.OK,
//                 success: true,
//                 message: "Admin deleted successfully!",
//                 data: {
//                     deleted_item_id: String(admin_id),
//                 },
//             });
//         }
//     );
// }