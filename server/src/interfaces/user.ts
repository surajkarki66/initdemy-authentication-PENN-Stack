export type UserRole = "SUBSCRIBER" | "INSTRUCTOR" | "ADMIN";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  picture: string;
  role: UserRole;
  stripeAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}
