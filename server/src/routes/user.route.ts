import { Router } from "express";

import userValidation from "../middlewares/validations/userValidation";
import userController from "../controllers/user.controller";
import showDataValidationResult from "../middlewares/showDataValidationError";
import {
  onlyOwnerCanDoThis,
  onlyActiveUserCanDoThisAction,
  onlyOwnerAndAdminCanDoThisAction,
} from "../middlewares/permissions/userPermissions";
import { authenticate, permit } from "../middlewares/auth";

import upload from "../utils/multer";

export default class UserRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  public routes(): void {
    this.router.post(
      "/register",
      userValidation("signup"),
      showDataValidationResult,
      userController.signup
    );
    this.router.post(
      "/login",
      userValidation("login"),
      showDataValidationResult,
      userController.login
    );
    this.router.get("/logout", userController.logOut);
    this.router.get(
      "/me",
      authenticate,
      permit(["SUBSCRIBER", "ADMIN"]),
      userController.me
    );
    this.router.post(
      "/verifyEmail",
      authenticate,
      permit(["SUBSCRIBER", "ADMIN"]),
      userValidation("verifyEmail"),
      showDataValidationResult,
      onlyOwnerCanDoThis,
      userController.verifyEmail
    );
    this.router.post(
      "/userActivation",
      userValidation("userActivation"),
      showDataValidationResult,
      userController.userActivation
    );
    this.router.post(
      "/forgotPassword",
      userValidation("forgotPassword"),
      showDataValidationResult,
      userController.forgotPassword
    );
    this.router.post(
      "/resetPassword",
      userValidation("resetPassword"),
      showDataValidationResult,
      userController.resetPassword
    );
    this.router.patch(
      "/changePassword",
      authenticate,
      permit(["SUBSCRIBER", "ADMIN"]),
      userValidation("changePassword"),
      showDataValidationResult,
      onlyOwnerCanDoThis,
      userController.changePassword
    );
    this.router.patch(
      "/changeEmail",
      authenticate,
      permit(["SUBSCRIBER", "ADMIN"]),
      userValidation("changeEmail"),
      showDataValidationResult,
      onlyActiveUserCanDoThisAction,
      onlyOwnerCanDoThis,
      userController.changeEmail
    );
    this.router.patch(
      "/uploadAvatar/:userId",
      authenticate,
      permit(["SUBSCRIBER", "ADMIN"]),
      onlyActiveUserCanDoThisAction,
      onlyOwnerCanDoThis,
      upload.single("avatar"),
      userController.uploadAvatar
    );
    this.router.delete(
      "/deleteUser",
      authenticate,
      permit(["SUBSCRIBER", "ADMIN"]),
      userValidation("deleteUser"),
      showDataValidationResult,
      onlyOwnerAndAdminCanDoThisAction,
      userController.deleteUser
    );

    this.router.get("/loggedIn", userController.loggedIn);
    this.router.get("/csrf-token", (req, res) => {
      return res.json({ csrfToken: req.csrfToken() });
    });
  }
}
