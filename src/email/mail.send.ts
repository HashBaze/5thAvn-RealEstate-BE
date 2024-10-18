import transporter from "./mail.config";

export const sendMail = async (
  email: string,
  subject: string,
  text: string,
  name: string
) => {

  console.log(email, subject, text, name); 
  try {
   const res =  await transporter.sendMail({
      from: email,
      to: `${process.env.MAIL_USER}`,
      subject: subject,
      text: text,
      html: `<b>Hello ${name},</b><br> ${text}`,
      replyTo: email,
    });
    console.log("Email sent successfully",res);
  } catch (error) {
    console.log(error);
  }
};
