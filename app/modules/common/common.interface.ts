import { Types } from "mongoose";

// common schema
export interface ICommonSchema {
    _id?: string | Types.ObjectId;
    createdAt?: number;
    updatedAt?: number;
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
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export interface IApiReponse<T> {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: {
        page?: number;
        limit?: number;
        showingTotal?: number;
        total: number;
    };
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
