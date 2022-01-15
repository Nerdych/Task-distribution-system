// Core
import nodemailer, {Transporter} from "nodemailer";

// Helpers
import {validateEmail} from "../helpers/validateEmail";

// Args
import {sendMailArgs} from "../args/mail/mailArgs";

class MailService {
    transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            secure: false,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMail({to, html}: sendMailArgs): Promise<boolean> {
        if (!validateEmail(to)) {
            return false;
        }

        let info = await this.transporter.sendMail({
            from: 'Система распределения задач',
            subject: "Регистрация в системе распределения задач",
            to,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return true;
    }
}

export default new MailService();