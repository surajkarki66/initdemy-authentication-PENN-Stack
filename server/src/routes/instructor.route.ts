import { Router } from "express";

import { authenticate, permit } from "../middlewares/auth";
import instructorController from "../controllers/instructor.controller";
import showDataValidationResult from "../middlewares/showDataValidationError";
import instructorValidation from "../middlewares/validations/instructorValidation";
import { onlyOwnerCanDoThis } from "../middlewares/permissions/userPermissions";

export default class InstructorRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  public routes(): void {
    this.router.post(
      "/make-instructor",
      authenticate,
      permit(["SUBSCRIBER"]),
      onlyOwnerCanDoThis,
      instructorValidation("makeInstructor"),
      showDataValidationResult,
      instructorController.makeInstructor
    );
  }
}
