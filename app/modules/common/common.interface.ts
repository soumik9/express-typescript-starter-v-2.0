import { Types } from "mongoose";

// common schema
export interface ICommonSchema {
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

export interface IKeyValueObject {
    [key: string]: string | undefined;
};

export type QueryParams = Record<string, string | boolean>;

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

export interface ISendEmail {
    toEmail: string;
    fromEmail?: string;
    subject: string;
    template: string;
    data: object;
}

export interface IPhoneCountry {
    code?: string;      // e.g., "US", "UK", "IN"
    name: string;      // e.g., "United States", "United Kingdom"
    dial_code: string;  // e.g., "+1", "+44", "+91"
}