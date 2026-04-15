// admin.controller.ts
import httpStatus from "http-status";
import { ApiError } from "../../../config";
import { AdminService } from "./admin.service";
import { IAdminResponse } from "./admin.interface";
import { AdminRoleEnum } from "../../../libs/enum";
import { EmailTemplateService } from "../shared/email";
import { Request, RequestHandler, Response } from "express";
import { SecurityInstance } from "../../../libs/helper/auth";
import { FileInstance, RandomInstance } from "../../../libs/helper";
import { ParserInstance, ResponseInstance } from "../../../libs/helper/core";

export class AdminController {
    constructor(
        private readonly service: AdminService,
        private readonly emailTemplateService: EmailTemplateService,
    ) { }

    // get data with pagination & filter
    public readonly getFilteredPaginated: RequestHandler = ResponseInstance.catchAsync(
        async (req: Request, res: Response) => {

            const { page, limit } = ParserInstance.query(req.query);
            const result = await this.service.getFilteredPaginated({
                page,
                limit,
                query: {},
                filterWithDto: true,
            });

            ResponseInstance.success<IAdminResponse[]>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Admins retrieved successfully!",
                meta: result.meta,
                data: result.data,
            });
        }
    );

    // get single data by id
    public readonly getSingle: RequestHandler = ResponseInstance.catchAsync(
        async (req: Request, res: Response) => {

            const { admin_id } = ParserInstance.query(req.query);
            const result = await this.service.findOrThrow({
                query: {
                    _id: admin_id,
                },
                isItemShouldExist: true,
                filterWithDto: true,
            });

            ResponseInstance.success<IAdminResponse>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Admin retrieved successfully!",
                data: result,
            });
        }
    );

    // create controller
    public readonly createSingle: RequestHandler = ResponseInstance.catchAsync(
        async (req: Request, res: Response) => {

            const body = req.body;

            // check admin existence with the email
            await this.service.findOrThrow({
                query: {
                    email: body.email,
                },
                isConflicted: true,
                conflictMessage: "Admin with this email already exists!",
            });

            const randomPassword = RandomInstance.generatePassword(6);

            // create admin
            const result = await this.service.createOne({
                data: {
                    ...body,
                    password: randomPassword,
                },
                filterWithDto: true,
            });
            if (result) {
                await this.emailTemplateService.sendAdminInviteEmail({
                    email: result.email,
                    name: result.name,
                    rawPassword: randomPassword
                });
            }

            ResponseInstance.success<any>(res, {
                statusCode: httpStatus.CREATED,
                success: true,
                message: "Admin created successfully!",
                data: result,
            });
        }
    );

    // update controller
    public readonly updateSingle: RequestHandler = ResponseInstance.catchAsync(
        async (req: Request, res: Response) => {

            const body = req.body;
            const { admin_id: query_admin_id } = ParserInstance.query(req.query);
            const { email, password, ...data } = body; // remove email, password from data

            // check if admin exists
            const admin = await this.service.findOrThrow({
                query: {
                    _id: query_admin_id,
                },
                isItemShouldExist: true,
                filterWithDto: false,
            });
            if (admin.role === AdminRoleEnum.SuperAdmin) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'You can not update this admin!');
            }

            // update data
            const result = await this.service.updateOne({
                query: {
                    _id: query_admin_id,
                },
                data,
                filterWithDto: true,
            });

            ResponseInstance.success<any>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Admin updated successfully!",
                data: result,
            });
        }
    );

    // update controller
    public readonly updateSelf: RequestHandler = ResponseInstance.catchAsync(
        async (req: Request, res: Response) => {

            const body = req.body;
            const admin_id = req.entity!._id;
            const { email, ...data } = body; // remove email, password from data

            // Handle file upload
            const { movedFile, cleanup } = await FileInstance.handleSingleUpload(
                req.files,
                `staff/${admin_id}`
            );

            try {
                const admin = await this.service.findOrThrow({
                    query: {
                        _id: admin_id,
                    },
                    isItemShouldExist: true,
                    filterWithDto: false,
                });
                const oldPathToDelete = (movedFile && admin.image?.path) ? admin.image.path : undefined;

                if (data.password) {
                    const hashed = await SecurityInstance.generateHash(String(data.password));
                    data.password = hashed;
                }

                // update data
                const result = await this.service.updateOne({
                    query: {
                        _id: admin_id,
                    },
                    data: {
                        ...data,
                        ...(movedFile ? { image: movedFile } : {})
                    },
                    filterWithDto: true,
                });

                // Delete old image file if a new one was uploaded
                if (movedFile && oldPathToDelete) {
                    await FileInstance.delete(oldPathToDelete);
                }

                ResponseInstance.success<any>(res, {
                    statusCode: httpStatus.OK,
                    success: true,
                    message: "Profile updated successfully!",
                    data: result,
                });
            } catch (err) {
                await cleanup();
                throw new ApiError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    `Admin update failed: ${err instanceof Error ? err.message : String(err)}`
                );
            }
        }
    );

    // delete controller
    public readonly deleteSingle: RequestHandler = ResponseInstance.catchAsync(
        async (req: Request, res: Response) => {

            const { admin_id } = ParserInstance.query(req.query);
            const admin = await this.service.findOrThrow({
                query: {
                    _id: admin_id,
                },
                isItemShouldExist: true,
                filterWithDto: false,
            });

            // can't delete default admin
            if (admin.role === AdminRoleEnum.SuperAdmin)
                throw new ApiError(httpStatus.BAD_REQUEST, 'You can not delete this admin!');

            // Note: "Cannot delete default admin" logic moves to the service
            await this.service.deleteOne({ _id: admin_id });

            ResponseInstance.success<{
                deleted_item_id: string
            }>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Admin deleted successfully!",
                data: {
                    deleted_item_id: String(admin_id)
                },
            });
        }
    );
}