import moment from "moment";
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
          .notEmpty()
          .isEmail()
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
        body("avatar")
          .default(`http://gravatar.com/avatar/${moment().unix()}?d=identicon`)
          .isString()
          .withMessage("avatar must be a string"),
      ];
    }
    case "login": {
      return [
        body("email", "Email is required")
          .notEmpty()
          .isEmail()
          .withMessage("Must be a valid email address"),
        body("password", "Password is required")
          .notEmpty()
          .isString()
          .withMessage("Password must be string"),
      ];
    }

    case "userActivation": {
      return [
        body("token", "Token is required")
          .notEmpty()
          .isJWT()
          .withMessage("Must be a valid jwt"),
      ];
    }
    case "forgotPassword": {
      return [
        body("email", "Email is required")
          .notEmpty()
          .isEmail()
          .withMessage("Must be a valid email address"),
      ];
    }
    case "resetPassword": {
      return [
        body("resetLink", "resetLink is required")
          .notEmpty()
          .isJWT()
          .withMessage("Must be a valid jwt"),

        body("newPassword", "New Password is required")
          .notEmpty()
          .isString()
          .withMessage("New Password must be string")
          .isLength({ min: 6, max: 64 })
          .withMessage("New Password must be greater than 6 ")
          .matches("[0-9]")
          .withMessage("New Password Must Contain a Number")
          .matches("[A-Z]")
          .withMessage("New Password Must Contain an Uppercase"),
      ];
    }
    case "changePassword": {
      return [
        body("oldPassword", "Old Password is required")
          .notEmpty()
          .isString()
          .withMessage("Old Password must be string"),

        body("newPassword", "New Password is required")
          .notEmpty()
          .isString()
          .withMessage("New Password must be string")
          .isLength({ min: 6, max: 64 })
          .withMessage("New Password must be greater than 6 ")
          .matches("[0-9]")
          .withMessage("New Password Must Contain a Number")
          .matches("[A-Z]")
          .withMessage("New Password Must Contain an Uppercase"),

        body("userId", "UserId is required")
          .notEmpty()
          .isString()
          .withMessage("UserId must be string"),
      ];
    }
    case "verifyEmail": {
      return [
        body("userId", "userId is required")
          .notEmpty()
          .isString()
          .withMessage("userId must be string"),
      ];
    }
    case "changeEmail": {
      return [
        body("email", "Email is required")
          .notEmpty()
          .isEmail()
          .withMessage("Must be a valid email address"),
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
