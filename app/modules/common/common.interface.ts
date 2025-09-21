export interface IKeyValueObject {
    [key: string]: string | undefined;
};

export type QueryParams = Record<string, string | boolean>;

export interface ISendEmail {
    toEmail: string;
    fromEmail?: string;
    subject: string;
    template: string;
    data: object;
}

export interface IPhoneCountry {
    code: string;      // e.g., "US", "UK", "IN"
    name: string;      // e.g., "United States", "United Kingdom"
    dial_code: string;  // e.g., "+1", "+44", "+91"
}