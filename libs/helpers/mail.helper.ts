import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import httpStatus from "http-status";
import { ISendEmail } from "../../app/modules";
import { config, transporter, infoLogger, ApiError } from "../../config";

// @desc: Add template caching mechanism
const templateCache: Record<string, HandlebarsTemplateDelegate> = {};

// @helper: Render template
export const renderTemplate = (templateName: string, data: object, isUseCache = true) => {
    let template: Handlebars.TemplateDelegate;

    if (isUseCache && templateCache[templateName]) {
        template = templateCache[templateName];
    } else {
        const filePath = path.resolve(process.cwd(), "app", "views", `${templateName}.template.hbs`);
        const source = fs.readFileSync(filePath, "utf8");
        template = handlebars.compile(source);
        if (isUseCache)
            templateCache[templateName] = template;
    }

    return template(data);
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
            infoLogger.info(`Server is ready to take our messages`);
        }

        const htmlContent = renderTemplate(template, data);
        if (!htmlContent)
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Template not found");

        const response = await transporter.sendMail({
            from: fromEmail ? fromEmail : config.MAIL.FROM,
            to: toEmail,
            subject: subject,
            html: htmlContent,
        });

        infoLogger.info(`Message sent: ${toEmail} with ID: ${response.messageId}`);
        return response;
    } catch (error) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            `Failed to send email: ${error instanceof Error ? error.message : 'unknown'}`
        );
    }
};