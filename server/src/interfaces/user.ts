export type UserRole = "SUBSCRIBER" | "ADMIN";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
