import { Admin } from "../../app/modules";
import { config, errorLogger, infoLogger } from "../../config";

export const seedDefaultAdmin = async () => {
    try {

        const adminSeederData = {
            name: "Admin",
            phone: config.SEEDER.DEFAULT_ADMIN.PHONE,
            password: config.SEEDER.DEFAULT_ADMIN.PASSWORD,
            role: config.SEEDER.DEFAULT_ADMIN.ROLE,
            country: {
                code: "BD",
                name: "Bangladesh",
                dial_code: "+880",
            },
        };

        const adminExists = await Admin.findOne({ phone: adminSeederData.phone });
        if (!adminExists) {
            const admin = new Admin(adminSeederData);
            await admin.save({ validateBeforeSave: false });
            infoLogger.info("Admin data seeded successfully.");
        } else
            console.log("Admin data already exists.");
    } catch (error) {
        errorLogger.error(`Error seeding admin data: ${error instanceof Error ? error.message : 'unknown'}`);
    }
};