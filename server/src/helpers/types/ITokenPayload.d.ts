import { ROLE } from "../../interfaces/user";

export interface ITokenPayload {
  id: string;
  role: ROLE;
  iat: number;
  exp: number;
  error: string;
}
