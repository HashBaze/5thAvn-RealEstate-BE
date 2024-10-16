import { Request, Response } from "express";
import { sendMail } from "./mail.send";


export const sendMailToCompany = async (req: Request, res: Response) => {
    const { email, subject, text, name } = req.body;
    try {
        await sendMail(email, subject, text, name);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}