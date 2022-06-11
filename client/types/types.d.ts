export type UserRole = "SUBSCRIBER" | "ADMIN";

export type User = {
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
  state: { user: User };
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

export type UserProps = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  cloudinaryId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type ProfileProps = {
  user: UserProps;
  loading: boolean;
  profileActivateHandler: (e: SyntheticEvent) => Promise<void>;
};
