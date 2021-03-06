import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import HttpException from "../../errors/HttpException";
import { IUser } from "../../interfaces/user";

const prisma = new PrismaClient();

const onlyOwnerCanDoThis = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    if (req.params && req.params.userId === userId) {
      return next();
    } else if (req.body.userId && req.body.userId === userId) {
      return next();
    } else if (req.params && req.body.userId && req.body.userId === userId) {
      return next();
    } else {
      throw new HttpException(403, "Only owner can do this action");
    }
  } catch (error) {
    next(error);
  }
};
const onlyActiveUserCanDoThisAction = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const { isActive } = (await prisma.user.findUnique({
      where: {
        id,
      },
    })) as IUser;

    if (isActive) {
      return next();
    }
    throw new HttpException(
      403,
      "Access denied: User is required to verify their email."
    );
  } catch (error) {
    next(error);
  }
};

const onlyOwnerAndAdminCanDoThisAction = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    if ((req.params && req.params.userId === userId) || role === "ADMIN") {
      return next();
    } else if (
      (req.body.userId && req.body.userId === userId) ||
      role === "ADMIN"
    ) {
      return next();
    } else if (
      (req.params && req.body.userId && req.body.userId === userId) ||
      role === "ADMIN"
    ) {
      return next();
    } else {
      throw new HttpException(403, "Only owner and admin can do this action");
    }
  } catch (error) {
    next(error);
  }
};

export {
  onlyOwnerCanDoThis,
  onlyActiveUserCanDoThisAction,
  onlyOwnerAndAdminCanDoThisAction,
};
