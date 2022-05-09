import { body, ValidationChain } from "express-validator";

export default function userValidation(method: string): ValidationChain[] {
  switch (method) {
    case "signup": {
      return [
        body("firstName", "First Name is required")
          .notEmpty()
          .trim()
          .isString()
          .withMessage("First Name must be string")
          .isLength({
            min: 2,
            max: 32,
          })
          .withMessage("First Name must be between 3 to 32 characters"),
        body("lastName", "Last Name is required")
          .notEmpty()
          .trim()
          .isString()
          .withMessage("Last Name must be string")
          .isLength({
            min: 2,
            max: 32,
          })
          .withMessage("Last Name must be between 3 to 32 characters"),
        body("email", "Email is required")
          .isEmail()
          .notEmpty()
          .withMessage("Must be a valid email address"),
        body("password", "Password is required")
          .notEmpty()
          .isString()
          .withMessage("Password must be string")
          .isLength({ min: 6, max: 64 })
          .withMessage("Password must be greater than 6 ")
          .matches("[0-9]")
          .withMessage("Password Must Contain a Number")
          .matches("[A-Z]")
          .withMessage("Password Must Contain an Uppercase"),
      ];
    }
    case "login": {
      return [
        body("email", "Email is required")
          .isEmail()
          .notEmpty()
          .withMessage("Must be a valid email address"),
        body("password", "Password is required")
          .notEmpty()
          .isString()
          .withMessage("Password must be string"),
      ];
    }

    default:
      return [];
  }
}
