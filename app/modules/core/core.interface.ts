import { Types } from "mongoose";

// common model
export interface ICommonModel {
    _id?: string | Types.ObjectId;
    created_at?: number;
    updated_at?: number;
    __v?: number;
}

export type IGenericErrorMessage = {
    path: string | number;
    message: string;
};

export type IGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorMessages: IGenericErrorMessage[];
};

export type IErrorMessage = {
    path: string | number;
    message: string;
};

export type IErrorResponse = {
    statusCode: number;
    message: string;
    errorMessages: IErrorMessage[];
    stack?: string;
    path?: string;
    error?: Error | null;
};

export interface IApiResponseMeta {
    total_items: number;
    total_pages: number;
    current_page: number;
    page_size: number;
    has_next_page: boolean;
    has_previous_page: boolean;
};

export interface IApiReponse<T> {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: IApiResponseMeta | null;
    data?: T | null;
};

export type IUploadFile = {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number
}

export interface IMulterFiles {
    single?: IUploadFile[] | undefined;
    multiple?: IUploadFile[] | undefined;
    // You can define other fields here as needed
}