import supertest from "supertest";
import { closeDatabase, connectDatabase, clearDatabase } from "../dbhandler";
import { graphqlRequest } from "../graphqlRequest";
import { deleteFile } from "../../src/middleware/fileManager";

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
    const query = /* GraphQL */ `
      mutation($svg: Upload!) {
        addKeyword(name: "testQUeryKeyword", svg: $svg) {
          id
          name
          svg
        }
      }
    `;

    const res = await graphqlRequest(query, request, {
      svg: "tests/files/sample.svg",
    });
    const savedKeyword = res.body.data.addKeyword;
    const filePath = "src/uploads/svg/sample.svg";
    expect(savedKeyword.id).toBeDefined();
    expect(savedKeyword.name).toBe("testQUeryKeyword");
    expect(savedKeyword.svg).toBe(filePath);
    deleteFile(filePath);
  });
});
