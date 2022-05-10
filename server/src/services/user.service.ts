import { PrismaClient } from "@prisma/client";

import config from "../configs/config";
import ApiError from "../errors/apiError";
import { IUser } from "../interfaces/user";
import { comparePassword, hashPassword } from "../utils/auth";
import { IRegisterUserInput } from "../interfaces/register-user-input";
import { ILoginUserInput } from "../interfaces/login-user-input";
import { NextFunction } from "express";
import { signToken } from "../helpers/jwtHelper";

const prisma = new PrismaClient();

export const isUserExist = async (email: string) => {
  try {
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUserByEmail) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  return (await prisma.user.findUnique({
    where: {
      email,
    },
  })) as IUser;
};

export const loginUser = async (
  next: NextFunction,
  loginInput: ILoginUserInput
) => {
  const { email, password } = loginInput;
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
    return { accessToken, user };
  }
  next(ApiError.badRequest("Incorrect password."));
  return;
};

export const createUser = async (
  next: NextFunction,
  inputUser: IRegisterUserInput
) => {
  try {
    const { email } = inputUser;
    if (await isUserExist(email)) {
      next(ApiError.badRequest("Email already taken."));
      return;
    }
    const hashedPassword = String(await hashPassword(inputUser.password));

    const user = await prisma.user.create({
      data: { ...inputUser, password: hashedPassword },
    });

    return user as IUser;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (id: string) => {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id,
      },
    })) as IUser;

    return user;
  } catch (error) {
    throw error;
  }
};
