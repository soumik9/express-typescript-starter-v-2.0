import bcrypt from "bcrypt";
import { Model, Document } from "mongoose";
import { config, errorLogger } from "../../config";

export class SeederService<T extends Document> {
    private static instances: Map<string, SeederService<any>> = new Map();

    private constructor(
        private model: Model<T>, private uniqueField: keyof T
    ) { }

    /** Singleton accessor per model */
    public static getInstance<U extends Document>(name: string, model: Model<U>, uniqueField: keyof U): SeederService<U> {
        if (!SeederService.instances.has(name)) {
            SeederService.instances.set(name, new SeederService<U>(model, uniqueField));
        }
        return SeederService.instances.get(name)!;
    }

    /** Seed default data */
    public async seedDefaultAdmin(): Promise<void> {
        try {
            const adminData = {
                name: "Admin",
                email: config.SEEDER.DEFAULT_ADMIN.EMAIL,
                password: await bcrypt.hash(config.SEEDER.DEFAULT_ADMIN.PASSWORD, Number(config.BCRYPT.SALT_ROUND)),
                role: config.SEEDER.DEFAULT_ADMIN.ROLE,
                country: {
                    code: "BD",
                    name: "Bangladesh",
                    dial_code: "+880",
                },
            };

            // const exists = await this.model.findOne({ [this.uniqueField]: adminData[this.uniqueField] }).lean();
            // if (!exists) {
            //     await this.model.create(adminData);
            //     infoLogger.info("Default admin seeded successfully.");
            // } else {
            //     infoLogger.warn("Default admin already exists.");
            // }
        } catch (error) {
            errorLogger.error(`Error seeding admin: ${error instanceof Error ? error.message : "unknown"}`);
        }
    }
}

// const AdminSeeder = SeederService.getInstance("AdminSeeder", Admin, "email");