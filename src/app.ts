"use-strict";
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { HttpError } from "http-errors";

//Load config
dotenv.config({ path: "config.env" });

connectDB();
const app: Application = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

//Routes
app.use("/events/topics", require("./routes/topics"));

app.use(function (err: HttpError, req: any, res: any, next: any) {
  console.log(err.name);
  res.status(err.status).send(err.message);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
