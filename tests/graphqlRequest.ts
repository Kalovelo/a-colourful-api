import { contentType } from "mime-types";
import { extname } from "path";
import supertest, { SuperTest } from "supertest";

const app = require("../src/app");
export const graphqlRequest = (
  query: string,
  app: SuperTest<supertest.Test>,
  variables: { [x: string]: any } = {}
) => {
  const map = Object.assign(
    {},
    Object.keys(variables).map((key) => [`variables.${key}`])
  );
  const request = app
    .post("/graphql")
    .field("operations", JSON.stringify({ query }))
    .field("map", JSON.stringify(map));

  Object.values(variables).forEach((value, i) => {
    if (contentType(extname(value))) {
      request.attach(`${i}`, value);
    } else {
      request.field(`${i}`, value);
    }
  });

  return request;
};