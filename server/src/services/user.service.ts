import { PrismaClient } from "@prisma/client";

import mailGun from "../configs/mailgun";
import config from "../configs/config";
import HttpException from "../errors/HttpException";
import { IUser } from "../interfaces/user";
import { comparePassword, hashPassword } from "../utils/auth";
import { IRegisterUserInput } from "../interfaces/register-user-input";
import { ILoginUserInput } from "../interfaces/login-user-input";
import { signToken, verifyToken } from "../helpers/jwtHelper";
import { ITokenPayload } from "../helpers/types/ITokenPayload";

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

export const loginUser = async (loginInput: ILoginUserInput) => {
  const { email, password } = loginInput;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new HttpException(400, "Email is not registered");
  }
  const match = await comparePassword(password, user.password);
  if (match) {
    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = signToken(payload, config.jwtExpires, config.jwtSecret);
    user.password = "";
    return { accessToken, user };
  }
  throw new HttpException(400, "Incorrect password!");
};

export const createUser = async (inputUser: IRegisterUserInput) => {
  try {
    const { email } = inputUser;
    if (await isUserExist(email)) {
      throw new HttpException(400, "Email is already registered");
    }
    const hashedPassword = String(await hashPassword(inputUser.password));

    const user = await prisma.user.create({
      data: { ...inputUser, password: hashedPassword },
    });

    user.password = "";
    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = signToken(
      payload,
      config.jwtExpiresForEmailActivation,
      config.jwtSecretForEmailActivation
    );
    const response = await mailGun.messages().send({
      from: `Initdemy <${config.email}>`,
      to: `${email}`,
      subject: `Confirmation email!`,
      html: `
                    <h1>Please click the following link to activate your email address!</h1>
                    <p>${config.url}/user/activate/${accessToken}</p>
                    <hr />
                    <p>The verification link will expired after 24 hours.</p>
                    <p>This email may contain sensitive information</p>
                    <p>${config.url}</p>
                `,
    });
    return { user, response };
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
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as IUser;

    return user;
  } catch (error) {
    throw error;
  }
};

export const activateUser = async (token: string) => {
  try {
    const response = await verifyToken({
      token,
      secretKey: config.jwtSecretForEmailActivation,
    });

    const { id, error } = response as unknown as ITokenPayload;
    const user = (await prisma.user.findUnique({
      where: {
        id,
      },
    })) as IUser;

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (error) {
      throw new HttpException(400, error);
    }

    const updateObject = {
      isActive: true,
      updatedAt: new Date(),
    };

    if (!user.isActive) {
      const updatedUser = (await prisma.user.update({
        where: { id },
        data: updateObject,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      })) as IUser;
      return updatedUser;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const requestForgotPassword = async (email: string) => {
  try {
    // Perform business logic
  } catch (error) {
    throw error;
  }
};
