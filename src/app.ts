import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { HttpError } from "http-errors";
import { graphqlHTTP } from "express-graphql";
import RootQuerySchema from "./schema/Root";
import { GraphQLError } from "graphql";

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
    customFormatErrorFn: (error: GraphQLError) => {
      const formattedError: {
        message: string;
        code?: string[] | string;
      } = { message: error.message };

      if (error.extensions?.code) formattedError.code = error.extensions.code;

      return formattedError;
    },
  })
);

module.exports = app;
