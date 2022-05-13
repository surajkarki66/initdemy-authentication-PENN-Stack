import csrf from "csurf";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";

import config from "./configs/config";
import UserRoutes from "./routes/user.route";
import InstructorRoutes from "./routes/instructor.route";
import apiErrorHandler from "./errors/apiErrorHandler";

class Server {
  private app: express.Application;
  private csrfProtection = csrf({
    cookie: true,
  });

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  private routes(): void {
    // General routes
    this.app.use("/api/users", new UserRoutes().router);
    this.app.use("/api/instructors", new InstructorRoutes().router);

    // Error handler route
    this.app.use(apiErrorHandler);
  }

  private middleware(): void {
    this.app.enable("trust proxy");
    this.app.use(
      cors({
        origin: config.url,
        credentials: true,
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    this.app.use(this.csrfProtection);

    if (config.env === "development") {
      this.app.use(morgan("dev"));
    }
  }

  public start(): void {
    this.app.listen(config.server.port, () => {
      console.log(
        `API is running at http://${config.server.hostname}:${config.server.port}`
      );
    });
  }
}

export default Server;
