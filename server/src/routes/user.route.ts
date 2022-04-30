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
  }
}
