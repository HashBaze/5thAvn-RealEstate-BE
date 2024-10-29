import mongoose from "mongoose";

let isConnected: boolean = false;

const connectDB = async (mongoUrl: string) => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(mongoUrl);
    isConnected = true;
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectDB;
