import { Request, Response } from "express";
import { sendMail } from "./mail.send";
import { logger } from "../utils/logger";


export const sendMailToCompany = async (req: Request, res: Response) => {
    const { email, subject, message, name } = req.body;
    try {
        await sendMail(email, subject, message, name);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        logger.error("Error while sending email", error);
        res.status(500).json({ message: "Internal server error" });
    }
}