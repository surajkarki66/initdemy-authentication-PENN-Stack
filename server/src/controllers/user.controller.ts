import { validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

import ApiError from "../errors/apiError";
import config from "../configs/config";
import writeServerResponse from "../helpers/response";
import errorFormatter from "../helpers/errorFormatters";
import {
  createUser,
  loginUser,
  getCurrentUser,
} from "../services/user.service";
import { IRegisterUserInput } from "../interfaces/register-user-input";
import { ILoginUserInput } from "../interfaces/login-user-input";
import { verifyToken } from "../helpers/jwtHelper";

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

    const user = await createUser(next, inputUser);
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
    const loginResponse = await loginUser(next, loginInput);

    const result = {
      status: "success",
      data: loginResponse,
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
    res.cookie("token", loginResponse?.accessToken, options);
    return writeServerResponse(res, serverResponse);
  } catch (error: any) {
    next(ApiError.internal(`Something went wrong: ${error.message}`));
    return;
  }
};

const logOut: RequestHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.clearCookie("token");
  const serverResponse = {
    result: { message: "Signout success" },
    statusCode: 200,
    contentType: "application/json",
  };
  return writeServerResponse(res, serverResponse);
};

const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const user = await getCurrentUser(id);
    if (user) {
      const result = { status: "success", data: user };
      const serverResponse = {
        result: result,
        statusCode: 200,
        contentType: "application/json",
      };
      return writeServerResponse(res, serverResponse);
    }
    next(ApiError.notFound("User not found"));
    return;
  } catch (error: any) {
    next(ApiError.internal(`Something went wrong: ${error.message}`));
    return;
  }
};

const loggedIn: RequestHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.send("");
    await verifyToken({ token, secretKey: String(config.jwtSecret) });
    res.send(token);
  } catch (err) {
    res.send("");
  }
};

export default {
  signup,
  login,
  logOut,
  me,
  loggedIn,
};
