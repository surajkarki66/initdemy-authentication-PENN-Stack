import jwt from "jsonwebtoken";

import { UserRole } from "./../interfaces/user";
import config from "../configs/config";

const signToken = (
  payload: { id: string; role: UserRole },
  expiresIn: string | number | undefined
) => {
  const secret = String(config.jwtSecret);
  const options = {
    expiresIn: expiresIn,
    issuer: "initdemy.com",
  };
  return jwt.sign(payload, secret, options);
};
const verifyToken = async ({
  token,
  secretKey,
}: {
  token: string;
  secretKey: string;
}) => {
  return jwt.verify(token, secretKey, (error, response) => {
    if (error) {
      if (String(error).startsWith("TokenExpiredError")) {
        return { error: "Expired link. Signup again." };
      }
      if (String(error).startsWith("JsonWebTokenError")) {
        return { error: "Invalid token." };
      }
    }
    return response;
  });
};
export { signToken, verifyToken };
