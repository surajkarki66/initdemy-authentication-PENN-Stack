import { Router } from "express";

import { authenticate, permit } from "../middlewares/auth";

export default class InstructorRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  public routes(): void {}
}
