import { body, ValidationChain } from "express-validator";

export default function instructorValidation(
  method: string
): ValidationChain[] {
  switch (method) {
    case "makeInstructor": {
      return [
        body("userId", "userId is required")
          .notEmpty()
          .isString()
          .withMessage("userId must be string"),
      ];
    }
    default:
      return [];
  }
}
