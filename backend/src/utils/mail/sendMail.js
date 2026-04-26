import { transporter } from './transporter.js'

export const sendMail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `"MERN Billing" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        return info;
    } catch (err) {
        console.log("Email error:", err);
        throw err;
    }
};