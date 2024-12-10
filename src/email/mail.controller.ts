import { Request, Response } from "express";
import { sendMail } from "./mail.send";
import { logger } from "../utils/logger";
import {
    BUYWITHUSTEMPLATE,
  DIGITALAPPRAISALTEMPLATE,
  RENTALAPPRESALTEMPLATE,
} from "./email.template";

export const sendMailToCompany = async (req: Request, res: Response) => {
  const { email, subject, message, name } = req.body;
  try {
    // await sendMail(email, subject, message);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    logger.error("Error while sending email", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendRentAppresal = async (req: Request, res: Response) => {
  const {
    email,
    name,
    phoneNumber,
    streetAddress,
    suburb,
    postCode,
    bedRooms,
    carSpace,
    bathroom,
    additionalDetails,
    additionalMessage,
  } = req.body;
  const emailBody = {
    email,
    name,
    phoneNumber,
    streetAddress,
    suburb,
    postCode,
    bedRooms,
    carSpace,
    bathroom,
    additionalDetails,
    additionalMessage,
  };
  try {
    await sendMail(
      email,
      "Rental Appresal Form Submission !",
      emailBody,
      RENTALAPPRESALTEMPLATE(emailBody)
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    logger.error("Error while sending email", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendDigitalAppraisal = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    email,
    address,
    propertyType,
    approximate,
    favouriteFeatures,
    sellingTime,
    homeAge,
    homeSize,
    favoriteFeatures,
    improvements,
    bedroom,
    bathroom,
    ensuite,
    livingareas,
    study,
    garaging,
    heatingCooling,
    funStuff,
    otherFeatures,
    referredBy,
    additionalComments,
  } = req.body;

  console.log(req.body);
  const emailBody = {
    firstName,
    lastName,
    mobileNumber,
    email,
    address,
    propertyType,
    approximate,
    favouriteFeatures,
    sellingTime,
    homeAge,
    homeSize,
    favoriteFeatures,
    improvements,
    bedroom,
    bathroom,
    ensuite,
    livingareas,
    study,
    garaging,
    heatingCooling,
    funStuff,
    otherFeatures,
    referredBy,
    additionalComments,
  };
  try {
    await sendMail(
      email,
      "Digital Appraisal Form Submission !",
      emailBody,
      DIGITALAPPRAISALTEMPLATE(emailBody)
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    logger.error("Error while sending email", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendBuyWithUs = async (req: Request, res: Response) => {
  const {
    name,
    phone,
    email,
    bestTimeToReach,
    interestedCities,
    homeType,
    bedrooms,
    bathrooms,
    garage,
    floors,
    budget,
    lotSize,
    amenities,
    additionalComments,
  } = req.body;

  const emailBody = {
    name,
    phone,
    email,
    bestTimeToReach,
    interestedCities,
    homeType,
    bedrooms,
    bathrooms,
    garage,
    floors,
    budget,
    lotSize,
    amenities,
    additionalComments,
  };
  try {
    await sendMail(
      email,
      "Buy With Us Form Submission !",
      emailBody,
      BUYWITHUSTEMPLATE(emailBody)
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    logger.error("Error while sending email", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
