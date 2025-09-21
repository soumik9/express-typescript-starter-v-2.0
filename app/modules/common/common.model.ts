import { Schema } from "mongoose";

export const PhoneCountrySchema = new Schema({
    code: {
        type: String,
        required: [true, 'Country code is required'],
    },
    name: {
        type: String,
        required: [true, 'Country name is required'],
    },
    dial_code: {
        type: String,
        required: [true, 'Country dial code is required'],
    },
}, { _id: false }
);