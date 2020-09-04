import supertest from "supertest";
import { closeDatabase, connectDatabase, clearDatabase } from "../dbhandler";

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
  it("POST /events/topics/keywords - should create & save keyword successfully", async () => {
    const name = "keywordName";
    const res = await request
      .post("/keywords")
      .field("name", name)
      .attach("svg", "tests/files/sample.svg");
    const savedKeyword = res.body;
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedKeyword._id).toBeDefined();
    expect(savedKeyword.name).toBe(name);
    expect(savedKeyword.svg).toBe("src/uploads/svg/sample.svg");
  });

  it("POST /events/topics/keywords - should fail create keyword unknown field", async () => {
    const name = "keywordName";
    const res = await request
      .post("/keywords")
      .field("name", name)
      .field("unknown", "hello")
      .attach("svg", "tests/files/sample.svg");
    const keyword = res.body;
    expect(keyword.unknown).toBeUndefined;
    expect(keyword.name).toBeUndefined;
  });

  it("POST /events/topics/keywords - should fail create keyword without required field", async () => {
    const res = await request.post("/keywords").attach("svg", "tests/files/sample.svg");
    expect(res?.status).toBe(400);
  });

  it("GET /events/topics/keywords should return all keywords", async () => {
    await request
      .post("/keywords")
      .field("name", "keyword 1")
      .attach("svg", "tests/files/sample.svg");
    await request
      .post("/keywords")
      .field("name", "keyword 2")
      .attach("svg", "tests/files/sample.svg");

    const res = await request.get("/keywords");

    const keywords = res.body;

    expect(keywords.length).toBe(2);
  });

  it("PUT /events/topics/keywords should update field", async () => {
    const res = await request
      .post("/keywords")
      .field("name", "keyword 1")
      .attach("svg", "tests/files/sample.svg");
    const keyword = res.body;

    const putRes = await request.put(`/keywords/${keyword._id}`).field("name", "new name");
    expect(putRes.body.name).toBe("new name");
  });

  it("PUT /events/topics/keywords should not update unknown field", async () => {
    const res = await request
      .post("/keywords")
      .field("name", "keyword 1")
      .attach("svg", "tests/files/sample.svg");
    const keyword = res.body;

    const putRes = await request
      .put(`/keywords/${keyword._id}`)
      .field("unknownField", "unknownValue");

    expect(putRes.body.unknownField).toBeUndefined();
  });
});
