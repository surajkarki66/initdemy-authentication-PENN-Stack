import { PrismaClient } from "@prisma/client";

import { IRegisterUserInput } from "../interfaces/register-user-input";
import { IUser } from "../interfaces/user";
import { hashPassword } from "../utils/auth";

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
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};
export const createUser = async (input: IRegisterUserInput): Promise<IUser> => {
  try {
    const hashedPassword = String(await hashPassword(input.password));
    const user = await prisma.user.create({
      data: { ...input, password: hashedPassword },
    });

    return user;
  } catch (error) {
    throw error;
  }
};
