import winston from "winston";

class ErrorHandler {
  _logger = winston.createLogger({
    level: "http",
    format: winston.format.json(),
    defaultMeta: { timestamp: Date.now() },
    transports: [new winston.transports.Console()],
  });

  public async handleError(
    err: Error,
    severity: String = "error",
    http: { req: any; res: any } = {
      req: null,
      res: null,
    }
  ): Promise<void> {
    switch (severity) {
      case "http":
        this._logger.http(err);
        break;
      default:
        this._logger.error(err);
        break;
    }
  }
}

export const errorHandler = new ErrorHandler();
