import { emailDefaultProps } from "./email.constant";
import { config, infoLogger } from "../../../../config";
import { brandDefault } from "../../../../libs/constant";
import { EmailTemplateEnum } from "../../../../libs/enum";
import { CommonEmailStyles } from "../../../../libs/style";
import { EmailInstance, MomentInstance } from "../../../../libs/helper";

export class EmailTemplateService {

    // send admin invite email
    public async sendAdminInviteEmail({
        email, name, rawPassword,
    }: {
        email: string; name: string; rawPassword: string;
    }): Promise<void> {
        EmailInstance.send({
            payload: {
                toEmail: email,
                fromEmail: `"Invite to ${brandDefault.name} Panel" <${String(config.MAIL.FROM)}>`,
                subject: `Invite to ${brandDefault.name} Panel`,
                template: EmailTemplateEnum.InviteNewAdmin,
                data: {
                    ...emailDefaultProps,
                    title: `Invite to ${brandDefault.name} Panel`,
                    name: name,
                    email: email,
                    password: rawPassword,
                    base_url: `${config.URL.BASE}`,
                    brand_name: brandDefault.name,
                    copyright_year: MomentInstance.currentYear(),
                    styles: CommonEmailStyles,
                },
            }
        });

        infoLogger.info(`Admin invite email sent to ${email}`);
    }
}