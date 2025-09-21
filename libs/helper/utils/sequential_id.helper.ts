import { Model } from "mongoose";
import httpStatus from "http-status";
import { ApiError } from "../../../config";

export interface IIdGenerator {
    prefix: string;           // The prefix for the ID (e.g., 'NLC')
    fieldName: string;        // The field name in the document (e.g., 'loanId')
    includeYear?: boolean;    // Whether to include the current year in the ID (default: true)
    digitLength?: number;     // The length of the numeric portion (default: 4)
    useCurrentYear?: boolean; // Use current year or check last ID's year (default: true)
}

// @helper: generate sequential id
export async function generateSequentialId<T>(model: Model<T>, options: IIdGenerator): Promise<string> {

    const {
        prefix, fieldName, includeYear = true, digitLength = 4, useCurrentYear = true
    } = options;

    try {
        // Get current year
        const currentYear = new Date().getFullYear().toString();

        // Find the latest document sorted by the specified field in descending order
        const latestDoc = await model.findOne({}, { [fieldName]: 1 })
            .sort({ [fieldName]: -1 }) // Sort by fieldName in descending order
            // .sort({ created_at: -1, _id: -1 })
            .lean();

        // If no documents exist, return the initial ID
        if (!latestDoc) {
            const initialId = includeYear
                ? `${prefix}${currentYear}${'1'.padStart(digitLength, '0')}`
                : `${prefix}${'1'.padStart(digitLength, '0')}`;
            return initialId;
        }

        const lastId = latestDoc[fieldName as keyof typeof latestDoc] as string;
        let uniqueId = '';

        // Match standard numeric IDs (e.g., NLC20250001)
        const yearLength = includeYear ? 4 : 0;
        const numericRegex = new RegExp(`^${prefix}(\\d{${yearLength}})(\\d{${digitLength}})$`);
        const match = lastId.match(numericRegex);

        if (match) {
            const lastYear = includeYear ? match[1] : currentYear;
            let lastIdNumber = parseInt(String(match[2]), 10);

            if (includeYear && useCurrentYear && lastYear !== currentYear) {
                // If a new year has started, reset counter
                uniqueId = `${prefix}${currentYear}${'1'.padStart(digitLength, '0')}`;
            } else if (lastIdNumber >= Math.pow(10, digitLength) - 1) {
                // Switch to alphanumeric when max number reached
                uniqueId = includeYear
                    ? `${prefix}${currentYear}A${'1'.padStart(digitLength, '0')}`
                    : `${prefix}A${'1'.padStart(digitLength, '0')}`;
            } else {
                // Increment number and maintain format
                uniqueId = includeYear
                    ? `${prefix}${lastYear}${(lastIdNumber + 1).toString().padStart(digitLength, '0')}`
                    : `${prefix}${(lastIdNumber + 1).toString().padStart(digitLength, '0')}`;
            }
        } else {
            // Check for alphanumeric format (e.g., NLC2025A0001)
            const alphaRegex = new RegExp(`^${prefix}(\\d{${yearLength}})([A-Z])(\\d{${digitLength}})$`);
            const alphaMatch = lastId.match(alphaRegex);

            if (alphaMatch) {
                const lastYear = includeYear ? alphaMatch[1] : currentYear;
                let alphaPart = alphaMatch[2]; // A, B, C...
                let numericPart = parseInt(String(alphaMatch[3]), 10);

                if (includeYear && useCurrentYear && lastYear !== currentYear) {
                    // If a new year starts, reset numbering
                    uniqueId = `${prefix}${currentYear}${'1'.padStart(digitLength, '0')}`;
                } else if (numericPart >= Math.pow(10, digitLength) - 1) {
                    // Move to the next letter when max number reached
                    alphaPart = String.fromCharCode(String(alphaPart).charCodeAt(0) + 1);
                    numericPart = 1; // Reset to 0001

                    uniqueId = includeYear
                        ? `${prefix}${lastYear}${alphaPart}${numericPart.toString().padStart(digitLength, '0')}`
                        : `${prefix}${alphaPart}${numericPart.toString().padStart(digitLength, '0')}`;
                } else {
                    // Increment within the same letter group
                    uniqueId = includeYear
                        ? `${prefix}${lastYear}${alphaPart}${(numericPart + 1).toString().padStart(digitLength, '0')}`
                        : `${prefix}${alphaPart}${(numericPart + 1).toString().padStart(digitLength, '0')}`;
                }
            } else {
                // If no valid previous ID found, start from the beginning
                uniqueId = includeYear
                    ? `${prefix}${currentYear}${'1'.padStart(digitLength, '0')}`
                    : `${prefix}${'1'.padStart(digitLength, '0')}`;
            }
        }

        return uniqueId;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            `Error generating ${fieldName}`
        );
    }
}