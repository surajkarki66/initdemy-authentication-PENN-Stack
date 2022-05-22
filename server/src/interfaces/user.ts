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
  resetLink: string;
  createdAt: Date;
  updatedAt: Date;
}
