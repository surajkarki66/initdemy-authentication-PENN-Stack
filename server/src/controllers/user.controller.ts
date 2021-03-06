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
  sendEmailVerification,
  changeUserEmail,
  uploadUserAvatar,
  removeUser,
  fetchUserDetails,
  updateUserDetails,
} from "../services/user.service";
import {
  IRegisterUserInput,
  ILoginUserInput,
  IChangePasswordInput,
  IResetPasswordInput,
  IUserActivationInput,
  IVerifyEmail,
  IForgotPassword,
  IChangeEmail,
  IDeleteUser,
  IChangeUserDetails,
} from "../interfaces/user-inputs";
import HttpException from "../errors/HttpException";
import { UserRole } from "@prisma/client";

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
    const { accessToken }: IUserActivationInput = req.body;
    const user = await activateUser(accessToken);
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

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId }: IVerifyEmail = req.body;
    const { user } = await sendEmailVerification(userId);

    const result = {
      status: "success",
      data: {
        message: "Confirmation email is sent! Please check your email.",
        user,
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

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email }: IForgotPassword = req.body;
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
    const { resetLink, newPassword }: IResetPasswordInput = req.body;
    const updatedUser = await resetUserPassword({ resetLink, newPassword });

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
    const { userId, oldPassword, newPassword }: IChangePasswordInput = req.body;
    const updatedUser = await changeUserPassword({
      oldPassword,
      newPassword,
      userId,
    });

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

const changeEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const role = user.role as UserRole;
    const { email, userId }: IChangeEmail = req.body;

    const { response, updatedUser } = await changeUserEmail(
      email,
      userId,
      role
    );
    const result = {
      status: "success",
      data: {
        message: `Activation email is sent! Please check your email. ${response.message}`,
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

const changeUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userDetails: IChangeUserDetails = req.body;
    const { userId } = req.params;

    const updatedUser = await updateUserDetails(userDetails, userId);

    const result = {
      status: "success",
      data: {
        message: "Changed user details successfully!",
        updatedUser,
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

const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    const { userId } = req.params;

    if (!file) {
      throw new HttpException(400, "No image selected.");
    }

    const filePath = file.path;
    const user = await uploadUserAvatar(userId, filePath);

    const result = {
      status: "success",
      data: {
        message: `Avatar uploaded successfully`,
        user,
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

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password }: IDeleteUser = req.body;

    const deletedUser = await removeUser({ userId, password });

    const result = {
      status: "success",
      data: {
        message: `User deleted successfully!`,
        deletedUser,
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
  res.clearCookie("accessToken");
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
const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await fetchUserDetails(userId);

    const result = { status: "success", data: user };
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

const loggedIn: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    await verifyToken({
      accessToken: accessToken,
      secretKey: config.jwtSecret,
    });
    res.send(accessToken);
  } catch (err) {
    next(err);
  }
};

export default {
  signup,
  login,
  logOut,
  verifyEmail,
  userActivation,
  getUserDetails,
  forgotPassword,
  resetPassword,
  changePassword,
  changeEmail,
  changeUserDetails,
  uploadAvatar,
  deleteUser,
  me,
  loggedIn,
};
