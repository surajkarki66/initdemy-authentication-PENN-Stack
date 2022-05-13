import { Request, Response, NextFunction, RequestHandler } from "express";

import { createInstructor } from "../services/instructor.service";
import writeServerResponse from "../helpers/response";

const makeInstructor: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId }: { userId: string } = req.body;
    const accountLink = await createInstructor(userId);

    const result = { status: "success", data: accountLink };
    const serverResponse = {
      result: result,
      statusCode: 201,
      contentType: "application/json",
    };

    return writeServerResponse(res, serverResponse);
  } catch (error) {
    next(error);
  }
};

export default { makeInstructor };
