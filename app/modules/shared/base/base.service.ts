// base.service.ts
import httpStatus from "http-status";
import { IApiResponseMeta } from "..";
import { ApiError } from "../../../../config";
import { IBaseFindParams } from "./base.interface";
import { PaginationInstance } from "../../../../libs/helper";
import { Model, FilterQuery, ClientSession, PopulateOptions } from "mongoose";

export abstract class BaseService<T> {
    constructor(
        protected readonly entityName: string,
        protected readonly model: Model<T>,
        protected readonly defaultMapper: any,
    ) { }

    // find or throw
    public async findOrThrow({
        query,
        isItemShouldExist = false,
        isConflicted = false,
        filterWithDto = false,
        conflictMessage = `${this.entityName} already exists!`,
        notFoundMessage = `${this.entityName} not found!`,
        populate,
    }: IBaseFindParams<T>): Promise<any> {

        const queryItem = await this.model.findOne(query).lean();

        // Handle DTO mapping early if item exists
        const item = (queryItem && filterWithDto) ? new this.defaultMapper(queryItem as T) : queryItem;
        if (populate) {
            await this.model.populate(queryItem, populate);
        }

        // Conflict check: Item exists when it shouldn't
        if (isConflicted && item) {
            throw new ApiError(httpStatus.CONFLICT, conflictMessage);
        }

        // Existence check: Item doesn't exist when it should
        if (isItemShouldExist && !item) {
            throw new ApiError(httpStatus.NOT_FOUND, notFoundMessage);
        }

        return item;
    }

    // create one data 
    public async createOne<R = T>({ data, filterWithDto = false, session, populate }: {
        data: Record<string, any>;
        filterWithDto?: boolean;
        populate?: PopulateOptions | PopulateOptions[];
        session?: ClientSession;
    }): Promise<R> {
        const docs = await this.model.create(
            Array.isArray(data) ? data : [data],
            { ...(session && { session }) }
        );
        // Guard against undefined/empty results
        if (!docs || docs.length === 0) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${this.entityName} creation failed!`);
        }

        let savedDoc = docs[0];
        if (populate) {
            await this.model.populate(savedDoc, populate);
        }

        const plainObject = savedDoc?.toObject();
        return filterWithDto ? new this.defaultMapper(plainObject as T) : (plainObject as R);
    }

    // get all
    public async getAll<R = T>({
        query = {}, filterWithDto = false, populate, sort
    }: {
        query?: FilterQuery<T>;
        filterWithDto?: boolean;
        populate?: PopulateOptions | PopulateOptions[];
        sort?: string | Record<string, 1 | -1 | 'asc' | 'desc'>;
    }): Promise<R[]> {
        const docs = await this.model.find(query).sort(sort || {}).lean();
        if (populate) {
            await this.model.populate(docs, populate);
        }
        return filterWithDto ? docs.map(doc => new this.defaultMapper(doc as T)) : (docs as R[]);
    }

    // get filtered and paginated
    public async getFilteredPaginated({
        page = 1, limit = 10, query = {}, filterWithDto = false, populate
    }: {
        page: number;
        limit: number;
        query: FilterQuery<T>;
        filterWithDto?: boolean;
        populate?: PopulateOptions | PopulateOptions[];
    }): Promise<{ meta: IApiResponseMeta; data: any[] }> {
        return await PaginationInstance.auto({
            model: this.model,
            page,
            limit,
            query,
            ...(populate ? { populate } : {}),
            dtoClass: filterWithDto ? this.defaultMapper : undefined,
        });
    }

    // update one method
    public async updateOne<R = T>({
        query, data, filterWithDto = false, updatedData, populate, session, options = { new: true, runValidators: true }
    }: {
        query: FilterQuery<T>;
        data: Record<string, any>;
        filterWithDto?: boolean;
        updatedData?: Record<string, any>;
        populate?: string | Record<string, any>;
        session?: ClientSession;
        options?: Record<string, any>;
    }): Promise<R> {

        const updateQuery: Record<string, any> = { ...updatedData };
        if (Object.keys(data).length > 0) {
            updateQuery.$set = data;
        }

        const result = await this.model.findOneAndUpdate(
            query,
            updateQuery,
            {
                ...options,
                ...(session && { session })
            }
        );

        if (!result) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                `${this.entityName} not found for update!`
            );
        }

        // Handle population if requested
        if (populate) {
            const paths = Array.isArray(populate) ? populate : [populate];
            for (const path of paths) {
                await (result as any).populate({
                    path: path as string,
                });
            }
        }

        return filterWithDto ? new this.defaultMapper(result as T) : (result as R);
    }

    // delete one method
    public async deleteOne(query: FilterQuery<T>): Promise<boolean> {
        const result = await this.model.deleteOne(query);
        if (result.deletedCount === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, `${this.entityName} not found for deletion!`);
        }
        return true;
    }

    // count method
    public async count({ query = {} }: { query?: FilterQuery<T>; }): Promise<number> {
        return this.model.countDocuments(query);
    }

    // aggregate method
    public async aggregate<R = any>(pipeline: any[]): Promise<R[]> {
        return this.model.aggregate<R>(pipeline).exec();
    }
}