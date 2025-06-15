import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import httpStatus from "http-status";
import { getCurrentTimestamp } from "./global.helper";
import { ISendEmail } from "../../app/modules";
import { config, transporter, infoLogger, ApiError } from "../../config";

// @helper: Add template caching mechanism
const templateCache: Record<string, HandlebarsTemplateDelegate> = {};

// @helper: Render template
export const renderTemplate = (templateName: string, data: object) => {
    // Check if template is already cached
    if (!templateCache[templateName]) {
        const filePath = path.resolve(
            process.cwd(),
            "app",
            "views",
            `${templateName}.template.hbs`
        );
        const source = fs.readFileSync(filePath, "utf8");
        templateCache[templateName] = handlebars.compile(source);
    }
    return templateCache[templateName](data);
};

// Verify once at startup or periodically, not for every email
let transporterVerified = false;

// @helper: Send mail
export const sendEmail = async (payload: ISendEmail) => {
    const { toEmail, subject, template, data, fromEmail } = payload;

    // Step 1: Check if the email is valid
    if (!toEmail)
        throw new ApiError(httpStatus.BAD_REQUEST, "TO Email is required");

    // Step 2: Check if the subject is valid
    if (!subject)
        throw new ApiError(httpStatus.BAD_REQUEST, "Subject is required");

    // Step 3: Check if the template is valid
    if (!template)
        throw new ApiError(httpStatus.BAD_REQUEST, "Template is required");

    try {
        if (!transporterVerified) {
            await transporter.verify();
            transporterVerified = true;
            infoLogger.info(`Server is ready to take our messages: ${getCurrentTimestamp()}`);
        }

        const htmlContent = renderTemplate(template, data);

        if (!htmlContent)
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Template not found");


        const response = await transporter.sendMail({
            from: fromEmail ? fromEmail : config.MAIL.ID,
            to: toEmail,
            subject: subject,
            html: htmlContent,
        });

        infoLogger.info(`Message sent: ${toEmail} with ID: ${response.messageId}`);
        return response;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to send email: ${error instanceof Error ? error.message : 'unknown'}`);
    }
};