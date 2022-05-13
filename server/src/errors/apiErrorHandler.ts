import { Request, Response, NextFunction } from "express";

import HttpException from "./HttpException";
import writeServerResponse from "../helpers/response";

const apiErrorHandler = (
  err: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let serverResponse = {
    result: {
      status: "failed",
      data: { error: err.message },
    },
    statusCode: err.errorCode,
    contentType: "application/json",
  };
  if (err && err.errorCode) {
    return writeServerResponse(res, serverResponse);
  } else if (err) {
    serverResponse = {
      result: {
        status: "failed",
        data: { error: `Something went wrong: ${err.message}` },
      },
      statusCode: 500,
      contentType: "application/json",
    };

    return writeServerResponse(res, serverResponse);
  }
};

export default apiErrorHandler;
