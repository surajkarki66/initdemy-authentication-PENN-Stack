import { Request, Response, NextFunction, RequestHandler } from "express";

import config from "../configs/config";
import writeServerResponse from "../helpers/response";
import {
  createUser,
  loginUser,
  getCurrentUser,
} from "../services/user.service";
import { IRegisterUserInput } from "../interfaces/register-user-input";
import { ILoginUserInput } from "../interfaces/login-user-input";
import { verifyToken } from "../helpers/jwtHelper";
import HttpException from "../errors/HttpException";

const signup: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputUser: IRegisterUserInput = req.body;

    const user = await createUser(inputUser);
    const serverResponse = {
      result: user,
      statusCode: 201,
      contentType: "application/json",
    };

    return writeServerResponse(res, serverResponse);
  } catch (error) {
    next(error);
  }
};

const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginInput: ILoginUserInput = req.body;
    const loginResponse = await loginUser(loginInput);

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
      maxAge: Number(config.jwtExpiresInMilsec),
    };
    res.cookie("token", loginResponse?.accessToken, options);
    return writeServerResponse(res, serverResponse);
  } catch (error: any) {
    next(error);
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
    throw new HttpException(404, "User not found");
  } catch (error: any) {
    next(error);
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
