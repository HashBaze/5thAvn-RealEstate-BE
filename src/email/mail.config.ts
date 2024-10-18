require("dotenv").config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: `${process.env.MAIL_USER}`,
    pass: `${process.env.MAIL_PASSWORD}`,
  },
});

export default transporter;
