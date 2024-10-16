import express from "express";

import { sendMailToCompany } from "./mail.controller";
const mailRoute = express.Router();

mailRoute.post("/send-company-email", sendMailToCompany);

export default mailRoute;
