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

const getSampleKeyword: () => Promise<string> = async () => {
  const res = await request
    .post("/keywords")
    .field("name", "keywordName")
    .attach("svg", "tests/files/sample.svg");
  const savedKeyword = res.body;
  return res.body._id as string;
};
describe("Topic Model Test", () => {
  it("POST /events/topics - should create & save topic successfully", async () => {
    const keywords = [await getSampleKeyword(), await getSampleKeyword()];
    const res = await request.post("/topics").send({
      name: "name",
      description: "description",
      keywords: keywords,
    });

    const savedTopic = res.body;
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedTopic._id).toBeDefined();
    expect(savedTopic.name).toBe("name");
    expect(savedTopic.description).toBe("description");
    expect([...savedTopic.keywords]).toMatchObject(keywords);
  });

  it("POST /events/topics - should fail create topic unknown field", async () => {
    const keywords = [await getSampleKeyword(), await getSampleKeyword()];
    const res = await request.post("/topics").send({
      name: "name",
      description: "description",
      keywords: keywords,
      unknown: "unknown",
    });

    const savedTopic = res.body;
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedTopic._id).toBeDefined();
    expect(savedTopic.name).toBe("name");
    expect(savedTopic.description).toBe("description");
    expect(savedTopic.unknown).toBeUndefined;
    expect([...savedTopic.keywords]).toMatchObject(keywords);
  });

  it("POST /events/topics - should fail create topic without required field", async () => {
    const res = await request.post("/topics").send({ name: "name" });
    expect(res?.status).toBe(400);
  });

  it("GET /events/topics should return all topics", async () => {
    await request.post("/topics").send({
      name: "topicName",
      description: "description",
      keywords: [await getSampleKeyword(), await getSampleKeyword()],
    });

    await request.post("/topics").send({
      name: "name",
      description: "description",
      keywords: [await getSampleKeyword(), await getSampleKeyword()],
    });

    const res = await request.get("/topics");
    const topics = res.body;
    expect(topics.length).toBe(2);
  });

  it("PUT /events/topics should update field", async () => {
    const res = await request.post("/topics").send({
      name: "name",
      description: "description",
      keywords: [await getSampleKeyword()],
    });

    const topic = res.body;
    const putRes = await request.put(`/topics/${topic._id}`).send({ name: "new name" });
    expect(putRes.body.name).toBe("new name");
  });

  it("PUT /events/topics should not update unknown field", async () => {
    const res = await request.post("/topics").send({
      name: "name",
      description: "description",
      keywords: [await getSampleKeyword()],
    });

    const topic = res.body;
    const putRes = await request
      .put(`/topics/${topic._id}`)
      .send({ name: "new name", unknownField: "unkown" });
    expect(putRes.body.name).toBe("new name");
    expect(putRes.body.unknownField).toBeUndefined();
  });

  it("DELETE /events/topics should delete topic", async () => {
    const res = await request.post("/topics").send({
      name: "name",
      description: "description",
      keywords: [await getSampleKeyword()],
    });
    const topic = res.body;

    const putRes = await request.put(`/topics/${topic._id}`).field("unknownField", "unknownValue");

    expect(putRes.body.unknownField).toBeUndefined();
  });
});
