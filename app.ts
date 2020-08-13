"use-strict";
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

//Load config
dotenv.config({ path: "./config/config.env" });

connectDB();
const app: Application = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

//Routes
app.use("/events", require("./routes/events"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
