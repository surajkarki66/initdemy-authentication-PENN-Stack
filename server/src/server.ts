import express from "express";
import morgan from "morgan";
import cors from "cors";

import config from "./configs/config";
import apiErrorHandler from "./errors/apiErrorHandler";

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  private routes(): void {
    // General routes

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
