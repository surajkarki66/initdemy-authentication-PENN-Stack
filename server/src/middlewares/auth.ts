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
  if (req.headers["authorization"]) {
    const authorization = req.headers["authorization"].split(" ");
    if (authorization[0] !== "Bearer") {
      throw new HttpException(401, "Authentication failed");
    } else {
      try {
        const response = await verifyToken({
          token: authorization[1],
          secretKey: String(config.jwtSecret),
        });

        const { id, error, role } = response as unknown as ITokenPayload;

        if (id) {
          req.user = { id: id, role };
          return next();
        }
        throw new HttpException(403, error);
      } catch (error) {
        next(error);
      }
    }
  } else {
    throw new HttpException(401, "Authentication failed");
  }
};

const permit = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (roles.includes(role)) {
      next();
    } else {
      throw new HttpException(401, `${role} is not allowed`);
    }
  };
};

export { authenticate, permit };
