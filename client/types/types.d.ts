export type UserRole = "SUBSCRIBER" | "INSTRUCTOR" | "ADMIN";

export type IUser = {
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
};

export type AuthContextType = {
  state: { user: IUser };
  csrfToken: string;
  accessToken: string | undefined;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
  dispatch: Dispatch<{
    type: any;
    payload?: any;
  }>;
};
