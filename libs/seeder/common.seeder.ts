import { User } from "../../app/modules";
import { config, errorLogger, infoLogger } from "../../config";
import { defaultImagePath } from "../constant";
import { ENUM_ROLE, ENUM_USER_STATUS } from "../enums";

export const seedDefaultAdmin = async () => {
    try {

        const adminSedderData = {
            name: "Admin",
            email: config.SEEDER.DEFAULT_ADMIN.EMAIL,
            password: config.SEEDER.DEFAULT_ADMIN.PASSWORD,
            role: ENUM_ROLE.ADMIN,
            phone: "+8801689201370",
            country: {
                code: "BD",
                name: "Bangladesh",
                dial_code: "+880",
            },
            image: defaultImagePath,
            status: ENUM_USER_STATUS.APPROVED,
        };

        const adminExists = await User.findOne({ email: adminSedderData.email });
        if (!adminExists) {
            const admin = new User(adminSedderData);
            await admin.save({ validateBeforeSave: false });
            infoLogger.warn("Admin data seeded successfully.");
        } else
            console.log("Admin data already exists.");
    } catch (error) {
        errorLogger.error(`Error seeding admin data: ${error instanceof Error ? error.message : 'unknown'}`);
    }
};