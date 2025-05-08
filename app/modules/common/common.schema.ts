import moment from "moment";
import { Schema } from "mongoose";

// Common schema for common fields
export const CommonSchema = new Schema({
    createdAt: {
        type: Number,
        default: () => moment().utc().unix(),
    },
    updatedAt: {
        type: Number,
        default: () => moment().utc().unix(),
    },
});

CommonSchema.statics.isExistsById = async function (id: string, select: string) {
    const isExists = await this.findById(id).select(select).lean();
    return isExists;
};

CommonSchema.pre("save", function (next) {
    this.updatedAt = moment().utc().unix();
    if (this.isNew) {
        this.createdAt = moment().utc().unix();
    }
    next();
});

// Middleware for update operations
CommonSchema.pre(
    ["updateOne", "findOneAndUpdate", "updateMany"],
    function (next) {
        this.set({ updatedAt: moment().utc().unix() });
        next();
    }
);