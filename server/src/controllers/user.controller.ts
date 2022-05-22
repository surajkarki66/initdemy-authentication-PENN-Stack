import { Request, Response, NextFunction, RequestHandler } from "express";

import config from "../configs/config";
import { verifyToken } from "../helpers/jwtHelper";
import writeServerResponse from "../helpers/response";
import {
  createUser,
  loginUser,
  getCurrentUser,
  activateUser,
  requestForgotPassword,
  resetUserPassword,
  changeUserPassword,
} from "../services/user.service";
import { IRegisterUserInput } from "../interfaces/register-user-input";
import { ILoginUserInput } from "../interfaces/login-user-input";
import HttpException from "../errors/HttpException";

const signup: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputUser: IRegisterUserInput = req.body;

    const { user } = await createUser(inputUser);
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
    const options: any = {
      secure: config.env === "production" ? true : false,
      httpOnly: config.env === "production" ? true : false,
      sameSite: config.env === "production" ? true : false,
      maxAge: Number(config.jwtExpiresInMilsec),
    };
    res.cookie("accessToken", loginResponse?.accessToken, options);
    return writeServerResponse(res, serverResponse);
  } catch (error) {
    next(error);
  }
};

const userActivation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    const user = await activateUser(token);
    const result = {
      status: "success",
      data: { message: "user successfully activated", user },
    };
    const serverResponse = {
      result: result,
      statusCode: 200,
      contentType: "application/json",
    };
    return writeServerResponse(res, serverResponse);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const { response } = await requestForgotPassword(email);

    const result = {
      status: "success",
      data: {
        message: `Email has been sent to ${email}. Follow the instruction to reset your password. ${response.message}`,
      },
    };
    const serverResponse = {
      result: result,
      statusCode: 200,
      contentType: "application/json",
    };
    return writeServerResponse(res, serverResponse);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resetLink, newPassword } = req.body;
    const updatedUser = await resetUserPassword(resetLink, newPassword);

    const result = {
      status: "success",
      data: {
        message: "Password has been reset successfully.",
        user: updatedUser,
      },
    };
    const serverResponse = {
      result: result,
      statusCode: 200,
      contentType: "application/json",
    };
    return writeServerResponse(res, serverResponse);
  } catch (error) {
    next(error);
  }
};
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const updatedUser = await changeUserPassword(
      oldPassword,
      newPassword,
      userId
    );

    const result = {
      status: "success",
      data: {
        message: "Password has been changed successfully.",
        user: updatedUser,
      },
    };
    const serverResponse = {
      result: result,
      statusCode: 200,
      contentType: "application/json",
    };
    return writeServerResponse(res, serverResponse);
  } catch (error) {
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
  } catch (error) {
    next(error);
  }
};

const loggedIn: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new HttpException(404, "Token not found");
    }
    await verifyToken({ token, secretKey: config.jwtSecret });
    res.send(token);
  } catch (err) {
    next(err);
  }
};

export default {
  signup,
  login,
  logOut,
  userActivation,
  forgotPassword,
  resetPassword,
  changePassword,
  me,
  loggedIn,
};
