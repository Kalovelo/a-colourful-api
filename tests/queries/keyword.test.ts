import supertest from "supertest";
import { closeDatabase, connectDatabase, clearDatabase } from "../dbhandler";
import { graphqlRequestUpload } from "../graphqlRequestUpload";
import { deleteFile } from "../../src/middleware/fileManager";
import Keyword from "../../src/models/Keyword";
import { graphql } from "graphql";
import RootQuerySchema from "../../src/schema/Root";
import { generateKeyword } from "./generateData";
const app = require("../../src/app");
const request = supertest(app);
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

describe("Keyword Model Test", () => {
  it("CREATE - should create & save keyword successfully", async () => {
    const res = await generateKeyword(request);
    const filePath = "src/uploads/svg/sample.svg";
    const savedKeyword = res.body.data.addKeyword;
    expect(savedKeyword.id).toBeDefined();
    expect(savedKeyword.name).toBe("testKeyword");
    expect(savedKeyword.svg).toBe(filePath);
    deleteFile(filePath);
  });

  it("CREATE - should fail create keyword unknown field", async () => {
    const query = /* GraphQL */ `
      mutation($svg: Upload!) {
        addKeyword(name: "testKeyword", svg: $svg, random: "random") {
          id
          name
          svg
        }
      }
    `;

    const res = await graphqlRequestUpload(query, request, {
      svg: "tests/files/sample.svg",
    });
    const keyword = res.body;
    expect(res.status).toBe(400);
    expect(keyword.name).toBeUndefined();
  });

  it("CREATE - should fail create keyword without required field", async () => {
    const query = /* GraphQL */ `
      mutation {
        addKeyword(name: "testKeyword") {
          id
        }
      }
    `;
    const res = await graphqlRequestUpload(query, request);
    const keyword = res.body;
    expect(res.status).toBe(400);
    expect(keyword.name).toBeUndefined();
  });

  it("GET - should all the keywords", async () => {
    await generateKeyword(request);
    await generateKeyword(request);

    const query = /* GraphQL */ `
      {
        keywords {
          id
          name
          svg
        }
      }
    `;

    const res = await graphql(RootQuerySchema, query);
    expect(res.data!.keywords.length).toBe(2);
  });

  it("GET - should get keyword with specific ID", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      query($keywordID: ID) {
        keyword(id: $keywordID) {
          id
          name
          svg
        }
      }
    `;

    const getRes = await graphql(RootQuerySchema, query, null, null, {
      keywordID: savedKeywordID,
    });
    expect(getRes.data!.keyword.id).toBe(savedKeywordID);
  });

  it("UPDATE - should create & save keyword successfully", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation($keywordID: String) {
        updateKeyword(id: $keywordID, name: "amazing") {
          name
          id
          svg
        }
      }
    `;

    const updateRes = await graphql(RootQuerySchema, query, null, null, {
      keywordID: savedKeywordID,
    });
    expect(updateRes.data!.updateKeyword.name).toBe("amazing");
  });

  it("DELETE - should delete keyword successfully", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation($keywordID: ID) {
        deleteKeyword(id: $keywordID) {
          name
          id
          svg
        }
      }
    `;

    await graphql(RootQuerySchema, query, null, null, {
      keywordID: savedKeywordID,
    });

    const keyword = Keyword.findById(savedKeywordID);
    expect(keyword).toBeUndefined;
  });
});
