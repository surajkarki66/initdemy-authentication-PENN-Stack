import { Request, Response, NextFunction, RequestHandler } from "express";

import config from "../configs/config";
import { ITokenPayload } from "../helpers/types/ITokenPayload";
import { verifyToken } from "../helpers/jwtHelper";
import HttpException from "../errors/HttpException";

const authenticate: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers["authorization"]) {
      const authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        throw new HttpException(
          401,
          "Authentication failed: Bearer token is missing!"
        );
      } else {
        const response = await verifyToken({
          accessToken: authorization[1],
          secretKey: String(config.jwtSecret),
        });

        const { id, error, role } = response as unknown as ITokenPayload;

        if (id) {
          req.user = { id: id, role };
          return next();
        }
        throw new HttpException(403, error);
      }
    } else {
      throw new HttpException(401, "JWT Token is required to authenticate");
    }
  } catch (error) {
    next(error);
  }
};

const permit = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.user;
      if (roles.includes(role)) {
        next();
      } else {
        throw new HttpException(401, `${role} is not allowed`);
      }
    } catch (error) {
      next(error);
    }
  };
};

export { authenticate, permit };
