import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const httpMiddlewere = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`[${method}] ${url} - ${res.statusCode} - ${duration}ms`);
  });

  res.on('error', (err: Error) => {
    logger.error(`[${method}] ${url} - Error: ${err.message}`);
  });

  next();
};