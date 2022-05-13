import { validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

import errorFormatter from "../helpers/errorFormatters";
import HttpException from "../errors/HttpException";

const showDataValidationResult: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    const msg = errors.array();
    throw new HttpException(422, msg[0]);
  }
  return next();
};

export default showDataValidationResult;
