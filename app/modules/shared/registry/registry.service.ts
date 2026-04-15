import { EmailTemplateService } from "../email";

export class SharedRegistry {
    // email template service
    private static _emailTemplateService: EmailTemplateService;
    public static get emailTemplateService(): EmailTemplateService {
        if (!this._emailTemplateService) {
            this._emailTemplateService = new EmailTemplateService();
        }
        return this._emailTemplateService;
    }
}