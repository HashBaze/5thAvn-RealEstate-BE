import { logger } from "../utils/logger";
import transporter from "./mail.config";

export const sendMail = async (
  email: string,
  subject: string,
  text: string,
  name: string
) => {

  try {
   const res =  await transporter.sendMail({
      from: email,
      to: `${process.env.MAIL_USER}`,
      subject: subject,
      text: text,
      html: `<b>Hello ${name},</b><br> ${text}`,
      replyTo: email,
    });
    logger.debug("Email sent successfully", res);
  } catch (error) {
    logger.error("Error while sending email", error);
  }
};
