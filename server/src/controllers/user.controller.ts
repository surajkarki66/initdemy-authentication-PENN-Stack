import { validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

import ApiError from "../errors/apiError";
import writeServerResponse from "../helpers/response";
import errorFormatter from "../helpers/errorFormatters";

const signup: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      const msg = errors.array();
      next(ApiError.badRequest(msg[0]));
      return;
    }
    // Todo: Sign up logic

    const serverResponse = {
      result: {},
      statusCode: 201,
      contentType: "application/json",
    };

    return writeServerResponse(res, serverResponse);
  } catch (error: any) {
    next(ApiError.internal(`Something went wrong: ${error.message}`));
    return;
  }
};
export default {
  signup,
};
