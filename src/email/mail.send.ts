import transporter from "./mail.config";

export const sendMail = async (
  email: string,
  subject: string,
  text: string,
  name: string
) => {
  try {
    await transporter.sendMail({
      from: `${process.env.MAIL_USER}`,
      to: email,
      subject: subject,
      text: text,
      html: `<b>Hello ${name},</b><br> ${text}`,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log(error);
  }
};
