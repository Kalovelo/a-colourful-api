import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { HttpError } from "http-errors";

//Load config
dotenv.config({ path: "config.env" });

const app: Application = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

//Routes
app.use("/topics", require("./routes/topics"));
app.use("/keywords", require("./routes/keywords"));

//Error Handle
app.use(function (err: HttpError, req: any, res: any, next: any) {
  console.log(err.name);
  res.status(err.status).send(err.message);
});

module.exports = app;
