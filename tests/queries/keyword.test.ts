import supertest from "supertest";
import { closeDatabase, connectDatabase, clearDatabase } from "../dbhandler";
import { graphqlRequestUpload } from "../graphqlRequestUpload";
import { deleteFile } from "../../src/middleware/fileManager";
import Keyword from "../../src/models/Keyword";
import { graphql } from "graphql";
import RootQuerySchema from "../../src/schema/Root";

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

const createSampleKeyword = async () => {
  const query = /* GraphQL */ `
    mutation($svg: Upload!) {
      addKeyword(name: "testQUeryKeyword", svg: $svg) {
        id
        name
        svg
      }
    }
  `;

  return await graphqlRequestUpload(query, request, {
    svg: "tests/files/sample.svg",
  });
};

describe("Keyword Model Test", () => {
  it("CREATE - should create & save keyword successfully", async () => {
    const res = await createSampleKeyword();
    const filePath = "src/uploads/svg/sample.svg";
    const savedKeyword = res.body.data.addKeyword;
    expect(savedKeyword.id).toBeDefined();
    expect(savedKeyword.name).toBe("testQUeryKeyword");
    expect(savedKeyword.svg).toBe(filePath);
    deleteFile(filePath);
  });

  it("UPDATE - should create & save keyword successfully", async () => {
    const res = await createSampleKeyword();
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
    const res = await createSampleKeyword();
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
