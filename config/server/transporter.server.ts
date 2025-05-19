import nodemailer from 'nodemailer'
import { config } from './config.server'

export const transporter = nodemailer.createTransport({
    host: config.MAIL.HOSTNAME,
    port: Number(config.MAIL.PORT),
    auth: {
        user: config.MAIL.ID,
        pass: config.MAIL.PASSWORD,
    },
})