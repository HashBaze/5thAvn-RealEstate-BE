import { logger } from "../utils/logger";
import { RENTALAPPRESALTEMPLATE } from "./email.template";
import transporter from "./mail.config";

export const sendMail = async (
  senderEmail: string,
  subject: string,
  textContent: object, 
  template: any
) => {
  try {
    const res = await transporter.sendMail({
      from: senderEmail, 
      to: `${process.env.MAIL_USER}`, 
      subject: subject,  
      text: JSON.stringify(textContent),  
      html: template, 
      replyTo: senderEmail, 
    });

    logger.debug("Email sent successfully", {});  
  } catch (error) {
    logger.error("Error while sending email", error);  
  }
};
