import { PrismaClient, UserRole } from "@prisma/client";

import mailGun from "../configs/mailgun";
import config from "../configs/config";
import HttpException from "../errors/HttpException";
import { IUser } from "../interfaces/user";
import { signToken, verifyToken } from "../helpers/jwtHelper";
import { ITokenPayload } from "../helpers/types/ITokenPayload";
import { comparePassword, hashPassword } from "../utils/auth";
import {
  IRegisterUserInput,
  ILoginUserInput,
  IResetPasswordInput,
  IChangePasswordInput,
  IDeleteUser,
  IChangeUserDetails,
} from "../interfaces/user-inputs";
import cloudinary from "../utils/cloudinary";

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
        cloudinaryId: true,
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
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        cloudinaryId: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
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
          cloudinaryId: true,
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
    const user = await getUserByEmail(email);
    if (user) {
      const { id, role } = user;
      const payload = {
        id,
        role,
      };

      const accessToken = signToken(
        payload,
        config.jwtExpiresForForgotPassword,
        config.jwtSecretForForgotPassword
      );

      const updateObject = {
        resetLink: accessToken,
        updatedAt: new Date(),
      };
      const updatedUser = (await prisma.user.update({
        where: { id },
        data: updateObject,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          cloudinaryId: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      })) as IUser;

      const response = await mailGun.messages().send({
        from: `Initdemy <${config.email}>`,
        to: `${email}`,
        subject: `Password Reset link!`,
        html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${config.url}/user/password-reset/${accessToken}</p>
                    <hr />
                    <p>The link will expired after 20 minutes.</p>
                    <p>This email may contain sensitive information</p>
                    <p>${config.url}</p>

                `,
      });
      return { updatedUser, response };
    } else {
      throw new HttpException(404, "User with that email does not exist");
    }
  } catch (error) {
    throw error;
  }
};

export const resetUserPassword = async (
  resetPasswordInput: IResetPasswordInput
) => {
  try {
    const { resetLink, newPassword } = resetPasswordInput;
    const response = await verifyToken({
      token: resetLink,
      secretKey: config.jwtSecretForForgotPassword,
    });

    const { id, error } = response as unknown as ITokenPayload;
    if (error) {
      throw new HttpException(400, error);
    }
    const user = (await prisma.user.findFirst({
      where: {
        resetLink,
      },
    })) as IUser;

    if (!user) {
      throw new HttpException(404, "Authentication error!");
    }
    const hashedPassword = String(await hashPassword(newPassword));
    const updateObject = {
      resetLink: "",
      password: hashedPassword,
      updatedAt: new Date(),
    };

    const updatedUser = (await prisma.user.update({
      where: { id },
      data: updateObject,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        cloudinaryId: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as IUser;

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const changeUserPassword = async (
  changePasswordInput: IChangePasswordInput
) => {
  const { userId, oldPassword, newPassword } = changePasswordInput;
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })) as IUser;
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    const match = await comparePassword(oldPassword, user.password);
    if (!match) {
      throw new HttpException(401, "Oops! Password is incorrect");
    }
    const hashedPassword = String(await hashPassword(newPassword));
    const updateObject = {
      password: hashedPassword,
      updatedAt: new Date(),
    };
    const updatedUser = (await prisma.user.update({
      where: { id: userId },
      data: updateObject,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        cloudinaryId: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as IUser;

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const sendEmailVerification = async (userId: string) => {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        cloudinaryId: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as IUser;
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    if (!user.isActive) {
      const { id, role, email } = user;
      const payload = {
        id,
        role,
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
    } else {
      throw new HttpException(400, "User is already activated");
    }
  } catch (error) {
    throw error;
  }
};

export const changeUserEmail = async (
  email: string,
  userId: string,
  role: UserRole
) => {
  try {
    const user = await getUserByEmail(email);

    if (user && user.id !== userId) {
      throw new HttpException(409, "Email is already taken!");
    }
    const updateObject = {
      email: email,
      isActive: false,
      updatedAt: new Date(),
    };

    const updatedUser = (await prisma.user.update({
      where: { id: userId },
      data: updateObject,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        cloudinaryId: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as IUser;

    const payload = {
      id: userId,
      role,
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
    return { updatedUser, response };
  } catch (error) {
    throw error;
  }
};

export const uploadUserAvatar = async (userId: string, filePath: string) => {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })) as IUser;
    if (user.cloudinaryId) {
      await cloudinary.uploader.destroy(user.cloudinaryId);
    }
    const result = await cloudinary.uploader.upload(filePath);
    const updateObject = {
      avatar: result?.secure_url || user.avatar,
      cloudinaryId: result?.public_id || user.cloudinaryId,
      updatedAt: new Date(),
    };

    const updatedUser = (await prisma.user.update({
      where: { id: userId },
      data: updateObject,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        cloudinaryId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as IUser;
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const removeUser = async (removeUserInput: IDeleteUser) => {
  try {
    const { userId, password } = removeUserInput;
    const user = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })) as IUser;
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    const actualPassword = user.password;
    const match = await comparePassword(password, actualPassword);
    if (!match) {
      throw new HttpException(401, "Oops! Password is incorrect");
    }
    if (user.cloudinaryId) {
      await cloudinary.uploader.destroy(user.cloudinaryId);
    }
    const deletedUser = (await prisma.user.delete({
      where: { id: userId },
    })) as IUser;
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

export const fetchUserDetails = async (userId: string) => {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })) as IUser;
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUserDetails = async (
  changeUserInput: IChangeUserDetails,
  userId: string
) => {
  try {
    const updateObject = {
      ...changeUserInput,
      updatedAt: new Date(),
    };
    const updatedUser = (await prisma.user.update({
      where: { id: userId },
      data: updateObject,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        cloudinaryId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as IUser;
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
