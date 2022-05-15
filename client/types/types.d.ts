export type UserRole = "SUBSCRIBER" | "ADMIN";

export type IUser = {
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

export type TokenPayload = {
  id: string;
  role: ROLE;
  iat: number;
  exp: number;
  error: string;
};
