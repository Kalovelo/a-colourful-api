import express, { Application } from "express";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import RootQuerySchema from "./schema/Root";
import { GraphQLError } from "graphql";
import cookieParser from "cookie-parser";
import { handleToken, isAdmin } from "./middleware/Auth";

const { graphqlUploadExpress } = require("graphql-upload");

//Load config
dotenv.config({ path: "config.env" });

const app: Application = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 🍪 cookies 🍪
app.use(cookieParser());

// JWT
app.use(handleToken);

//GraphQL
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP((req, res) => ({
    schema: RootQuerySchema,
    graphiql: true,
    context: { req, res },
    customFormatErrorFn: (error: GraphQLError) => {
      if (error.message.includes("Cast to ObjectId failed")) error.message = "Invalid ID.";
      const formattedError: {
        message: string;
        status?: string[] | number;
      } = { message: error.message, status: 400 };
      if (error.extensions?.code) formattedError.status = error.extensions.code;
      return formattedError;
    },
  }))
);

module.exports = app;
