export interface IRegisterUserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
}

export interface ILoginUserInput {
  email: string;
  password: string;
}

export interface IResetPasswordInput {
  resetLink: string;
  newPassword: string;
}

export interface IChangePasswordInput {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface IUserActivationInput {
  token: string;
}

export interface IVerifyEmail {
  userId: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IChangeEmail {
  email: string;
  userId: string;
}

export interface IDeleteUser {
  userId: string;
  password: string;
}

export interface IChangeUserDetails {
  firstName: string;
  lastName: string;
}
