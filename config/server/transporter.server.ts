// mail.service.ts
import { config } from './config.server';
import nodemailer, { Transporter } from 'nodemailer';

export class TransporterService {
    private static instance: TransporterService;
    private transporter: Transporter;

    private constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.MAIL.HOSTNAME,
            port: Number(config.MAIL.PORT),
            auth: {
                user: config.MAIL.ID,
                pass: config.MAIL.PASSWORD,
            },
        });
    }

    public static getInstance(): TransporterService {
        if (!TransporterService.instance) {
            TransporterService.instance = new TransporterService();
        }
        return TransporterService.instance;
    }

    /**
     * Get the nodemailer transporter instance
     */
    public getTransporter(): Transporter {
        return this.transporter;
    }


    public async sendMail(options: nodemailer.SendMailOptions) {
        return this.transporter.sendMail(options);
    }

    public async verify() {
        return this.transporter.verify();
    }
}

// Ready-to-use singleton
export const TransporterInstance = TransporterService.getInstance();
