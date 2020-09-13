import { CookieAccessInfo } from "cookiejar";
import { graphql } from "graphql";
import supertest from "supertest";
import User from "../../src/models/User";
import RootQuerySchema from "../../src/schema/Root";
import { clearDatabase, closeDatabase, connectDatabase } from "../dbhandler";
import { generateAdmin, generateSession } from "./generateData";
const app = require("../../src/app");
const request = supertest.agent(app);
/**
 * Connect to a new in -memory database before running any tests.
 **/
beforeAll(async () => await connectDatabase());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await closeDatabase());

describe("User Query Test", () => {
  it("REGISTER - should create & save user successfully", async () => {
    const res = await generateAdmin(request);
    expect(res.body.data.register.id).toBeDefined();
  });

  it("REGISTER - should fail to create user without required field", async () => {
    const query = /* GraphQL */ `
      mutation {
        register(username: "failUser") {
          id
        }
      }
    `;

    const res = await request.post("/graphql").send({
      query,
    });
    expect(res.body.errors[0].status).toBe(400);
  });

  it("REGISTER - should fail to create admin with wrong admin pass", async () => {
    const query = /* GraphQL */ `
      mutation {
        register(
          username: "failUser"
          password: "lalaalala"
          email: "lalal@lala.gr"
          adminPass: "lala"
        ) {
          id
        }
      }
    `;

    const res = await graphql(RootQuerySchema, query);

    const user = await User.findOne({ username: "failUser" });
    expect(res.errors).toBeDefined();
    expect(user).toBeNull();
  });

  it("REGISTER - should fail to create user with weak password", async () => {
    const query = /* GraphQL */ `
      mutation {
        register(username: "failUser", password: "lala", email: "lala@lala.gr") {
          id
        }
      }
    `;

    const res = await request.post("/graphql").send({
      query,
    });

    const user = await User.find({ usename: "failUser" });
    expect(user).toBeDefined();
    expect(res.body.errors[0].status).toBe(400);
  });

  it("LOGIN - should login user successfully", async () => {
    await generateAdmin(request);
    await generateSession(request);
    expect(request.jar.getCookie("access-token", new CookieAccessInfo(""))).toBeDefined();
    expect(request.jar.getCookie("refresh-token", new CookieAccessInfo(""))).toBeDefined();
  });

  it("LOGIN - should fail to login with invalid creds", async () => {
    await generateAdmin(request);
    const query = /* GraphQL */ `
      mutation {
        login(username: "admin", password: "_") {
          email
        }
      }
    `;

    const res = await request
      .post("/graphql")
      .send({
        query,
      })
      .set("Accept", "application/json");

    expect(res.body.errors[0].status).toBe(401);
  });
});
