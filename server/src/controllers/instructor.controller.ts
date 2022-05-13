import { Request, Response, NextFunction, RequestHandler } from "express";

import writeServerResponse from "../helpers/response";

const makeInstructor: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1: find user from db
    // 2: if user don't have stripe_account_id yet, then create new
    // 3: create account link based on account id (for frontend to complete onboarding)
    // 4: pre-fill any info such as email address (optional), then send url response to frontend
    // 5: then send the account link as response to frontend

    const serverResponse = {
      result: {},
      statusCode: 201,
      contentType: "application/json",
    };

    return writeServerResponse(res, serverResponse);
  } catch (error: any) {
    next(error);
  }
};

export { makeInstructor };
