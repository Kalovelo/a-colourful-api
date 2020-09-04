import supertest from "supertest";
import { closeDatabase, connectDatabase, clearDatabase } from "../dbhandler";
import { graphql } from "graphql";
import RootQuerySchema from "../../src/schema/Root";
import { generateKeyword, generateTopic } from "./generateData";
import Topic from "../../src/models/Topic";
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
  it("CREATE - should create & save Topic successfully", async () => {
    const topicRes = await generateTopic(request);
    const topic = topicRes.data!.addTopic;

    expect(topic.id).toBeDefined();
    expect(topic.name).toBe("testTopic");
    expect(topic.name).toBe("testTopic");
    expect(topic.description).toBe("testTopicDescription");
    expect(topic.keywords[0].name).toBe("testKeyword");
  });

  it("CREATE - should fail create Topic unknown field", async () => {
    const keywordRes = await generateKeyword(request);
    const keywordID = keywordRes.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation($keywords: [ID]!) {
        addTopic(
          name: "testTopic"
          randomField: "random"
          description: "testTopicDescription"
          keywords: $keywords
        ) {
          name
          id
          description
          keywords {
            name
          }
        }
      }
    `;

    const res = await graphql(RootQuerySchema, query, null, null, {
      keywords: [keywordID],
    });
    expect(res.errors).toBeDefined();
  });

  it("CREATE - should fail create Topic unknown field", async () => {
    const keywordRes = await generateKeyword(request);
    const keywordID = keywordRes.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation($keywords: [ID]!) {
        addTopic(randomField: "random", description: "testTopicDescription", keywords: $keywords) {
          name
          id
          description
          keywords {
            name
          }
        }
      }
    `;

    const res = await graphql(RootQuerySchema, query, null, null, {
      keywords: [keywordID],
    });
    expect(res.errors).toBeDefined();
  });

  it("GET - should all the keywords", async () => {
    await generateTopic(request);
    await generateTopic(request);

    const query = /* GraphQL */ `
      {
        topics {
          id
        }
      }
    `;

    const res = await graphql(RootQuerySchema, query);
    expect(res.data!.topics.length).toBe(2);
  });

  it("GET - should get keyword with specific ID", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.data!.addTopic.id;
    const query = /* GraphQL */ `
      query($topicID: ID) {
        topic(id: $topicID) {
          id
          name
        }
      }
    `;

    const getRes = await graphql(RootQuerySchema, query, null, null, {
      topicID: savedTopicID,
    });
    expect(getRes.data!.topic.id).toBe(savedTopicID);
  });

  it("UPDATE - should create & save keyword successfully", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.data!.addTopic.id;
    const query = /* GraphQL */ `
      mutation($topicID: ID!) {
        updateTopic(id: $topicID, name: "amazing") {
          name
          id
        }
      }
    `;

    const updateRes = await graphql(RootQuerySchema, query, null, null, {
      topicID: savedTopicID,
    });
    expect(updateRes.data!.updateTopic.name).toBe("amazing");
  });

  it("DELETE - should delete topic successfully", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.data!.addTopic.id;
    const query = /* GraphQL */ `
      mutation($topicID: ID!) {
        deleteTopic(id: $topicID) {
          name
          id
          svg
        }
      }
    `;

    await graphql(RootQuerySchema, query, null, null, {
      topicID: savedTopicID,
    });
    const topic = Topic.findById(savedTopicID);
    expect(topic).toBeUndefined;
  });
});
