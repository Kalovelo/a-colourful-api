import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLError } from "graphql";
import { handleToken } from "./middleware/Auth";
import RootQuerySchema from "./schema/Root";
import { errorHandler } from "./utils/errorHandler";
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

// health status
app.get("/_health", (_, res) => {
  res.status(200).send("ok");
});

//GraphQL
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP((req, res) => ({
    schema: RootQuerySchema,
    graphiql: true,
    context: { req, res },
    customFormatErrorFn: (error: GraphQLError) => {
      // log error
      (req as any).log = error.message;
      errorHandler.handleError(error, "http", { req, res });

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
