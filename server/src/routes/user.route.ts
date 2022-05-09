import { Router } from "express";

import userValidation from "../middlewares/validations/userValidation";
import userController from "../controllers/user.controller";

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
    this.router.get("/csrf-token", (req, res) => {
      return res.json({ csrfToken: req.csrfToken() });
    });
  }
}
