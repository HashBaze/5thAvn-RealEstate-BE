import mongoose from "mongoose";
import { logger } from "../utils/logger";

let isConnected: boolean = false;

const connectDB = async (mongoUrl: string) => {
  if (isConnected) {
    logger.info("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(mongoUrl);
    isConnected = true;
    logger.info("MongoDB is connected");
  } catch (error) {
    logger.error("Error while connecting to the database", error);
    throw error;
  }
};

export default connectDB;
