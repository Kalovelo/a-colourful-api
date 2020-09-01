import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { HttpError } from "http-errors";
import { graphqlHTTP } from "express-graphql";
import RootQuerySchema from "./schema/Root";

const { graphqlUploadExpress } = require("graphql-upload");

//Load config
dotenv.config({ path: "config.env" });

const app: Application = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//GraphQL
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP({
    schema: RootQuerySchema,
    graphiql: true,
  })
);

//Error Handle
app.use(function (err: HttpError, req: any, res: any, next: any) {
  console.log(err.name);
  res.status(err.status).send(err.message);
});

module.exports = app;
