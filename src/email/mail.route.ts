import express from "express";

import {
    sendBuyWithUs,
  sendDigitalAppraisal,
  sendMailToCompany,
  sendRentAppresal,
} from "./mail.controller";
const mailRoute = express.Router();

mailRoute.post("/send-company-email", sendMailToCompany);
mailRoute.post("/rent-appresal", sendRentAppresal);
mailRoute.post("/digital-appraisal", sendDigitalAppraisal);
mailRoute.post("/buy-with-us", sendBuyWithUs);

export default mailRoute;
