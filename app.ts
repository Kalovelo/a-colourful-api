"use-strict";
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
const app: Application = express();

//Load config
dotenv.config({ path: "./config/config.env" });

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
