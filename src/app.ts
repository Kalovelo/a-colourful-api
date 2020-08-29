import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { HttpError } from "http-errors";
import { graphqlHTTP } from "express-graphql";
import RootQuerySchema from "./schema/Root";
//Load config
dotenv.config({ path: "config.env" });

const app: Application = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: RootQuerySchema,
    graphiql: true,
  })
);

//Routes
app.use("/topics", require("./routes/topics"));
app.use("/keywords", require("./routes/keywords"));

//Error Handle
app.use(function (err: HttpError, req: any, res: any, next: any) {
  console.log(err.name);
  res.status(err.status).send(err.message);
});

module.exports = app;
