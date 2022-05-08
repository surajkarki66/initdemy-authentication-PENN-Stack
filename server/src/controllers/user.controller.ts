import { validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

import ApiError from "../errors/apiError";
import config from "../configs/config";
import writeServerResponse from "../helpers/response";
import errorFormatter from "../helpers/errorFormatters";
import {
  createUser,
  getUserByEmail,
  isUserExist,
} from "../services/user.service";
import { signToken } from "../helpers/jwtHelper";
import { comparePassword, hashPassword } from "../utils/auth";
import { IRegisterUserInput } from "../interfaces/register-user-input";
import { ILoginUserInput } from "../interfaces/login-user-input";

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

const login: RequestHandler = async (
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

    const loginInput: ILoginUserInput = req.body;
    const { email, password, rememberMe } = loginInput;
    const user = await getUserByEmail(email);
    if (!user) {
      next(ApiError.badRequest("Email is incorrect."));
      return;
    }

    const match = await comparePassword(password, user.password);
    if (match) {
      const payload = {
        id: user.id,
        role: user.role,
      };

      const accessToken = signToken(payload, config.jwtExpires);
      const result = {
        status: "success",
        data: { accessToken: accessToken },
      };
      const serverResponse = {
        result: result,
        statusCode: 200,
        contentType: "application/json",
      };
      let options: any = {
        secure: config.env === "production" ? true : false,
        httpOnly: config.env === "production" ? true : false,
        sameSite: config.env === "production" ? true : false,
      };
      res.cookie("token", accessToken, options);
      if (rememberMe) {
        options = { ...options, maxAge: Number(config.jwtExpires) };
        res.cookie("rememberMe", accessToken, options);
      }
      return writeServerResponse(res, serverResponse);
    }
    next(ApiError.badRequest("Incorrect password."));
    return;
  } catch (error: any) {
    next(ApiError.internal(`Something went wrong: ${error.message}`));
    return;
  }
};
export default {
  signup,
  login,
};
