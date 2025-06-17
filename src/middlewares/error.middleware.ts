import { NextFunction, Request, Response } from "express";
import logger from "../config/logs/logger";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`ERROR_APPLICATION: ${err}`);
  res.status(500).send({ errors: [{ message: "ERROR APPLICATION" }] });
};
