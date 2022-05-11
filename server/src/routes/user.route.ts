import { Router } from "express";

import userValidation from "../middlewares/validations/userValidation";
import userController from "../controllers/user.controller";
import { authenticate, permit } from "../middlewares/auth";

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
      userController.signup
    );
    this.router.post("/login", userValidation("login"), userController.login);
    this.router.get("/logout", userController.logOut);
    this.router.get(
      "/me",
      authenticate,
      permit(["SUBSCRIBER", "INSTRUCTOR", "ADMIN"]),
      userController.me
    );
    this.router.get("/loggedIn", userController.loggedIn);
    this.router.get("/csrf-token", (req, res) => {
      return res.json({ csrfToken: req.csrfToken() });
    });
  }
}
