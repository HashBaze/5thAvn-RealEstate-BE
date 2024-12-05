import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser } from "./user.interface";
import User from "./user.model";
import jwt from "jsonwebtoken";
import { logger } from "../../../utils/logger";

export const createUser = async (req: Request, res: Response) => {
  try {
    const userinfo: IUser = req.body;
    const { email, password } = userinfo;

    if (!email || !password) {
      logger.error("Email and password are required");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const enryptedpass = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: enryptedpass,
    });

    const userData = await user.save();
    logger.debug("User created successfully", userData);
    res.status(200).send({ message: "success", userId: userData._id });
  } catch (error) {
    logger.error("Internal server error", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {

  try {
    const userinfo: IUser = req.body;
    const { email, password } = userinfo;

    if (!email || !password) {
      logger.error("Email and password are required");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.error("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.error("Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "3h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
      userId: user._id,
    });
  } catch (error) {
    logger.error("Internal server error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
