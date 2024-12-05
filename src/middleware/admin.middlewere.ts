import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../app/modules/user/user.model";
import { logger } from "../utils/logger";

const adminVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      logger.error("JWT Authorization Header Missing");
      return res
        .status(403)
        .send({ message: "JWT Authorization Header Missing" });
    }
    const token = authorization.split(" ")[1];
    const decoded = (await jwt.verify(token, `${process.env.JWT_SECRET}`)) as {
      email: string;
    };
    const { email } = decoded;
    const validAdmin = await User.findOne({ email });

    if (!validAdmin) {
      logger.error("Unauthorized");
      return res
        .status(403)
        .send({ message: "JWT Authorization Header Missing" });
    }
    if (email) {
      next();
    } else {
      logger.error("Unauthorized");
      return res.status(403).send({ message: "Unauthorized" });
    }
  } catch (err) {
    logger.error(err);
    return next("Private Api");
  }
};

export default adminVerify;
