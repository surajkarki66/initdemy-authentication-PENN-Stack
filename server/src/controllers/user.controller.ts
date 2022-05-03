import { validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

import ApiError from "../errors/apiError";
import writeServerResponse from "../helpers/response";
import errorFormatter from "../helpers/errorFormatters";
import { createUser, isUserExist } from "../services/user.service";
import { IRegisterUserInput } from "../interfaces/register-user-input";

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

    const inputUser: IRegisterUserInput = req.body;
    const { email } = inputUser;

    if (await isUserExist(email)) {
      next(ApiError.badRequest("Email already taken."));
      return;
    }
    const user = await createUser(inputUser);
    const serverResponse = {
      result: user,
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
