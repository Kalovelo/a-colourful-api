import { CookieJar } from "cookiejar";
import supertest from "supertest";
import Topic from "../../src/models/Topic";
import { clearDatabase, closeDatabase, connectDatabase } from "../dbhandler";
import { emptyUploadFolders } from "../fileHandler";
import { generateKeyword, generateSession, generateTopic } from "./generateData";
const app = require("../../src/app");
const request = supertest.agent(app);
/**
 * Connect to a new in -memory database before running any tests.
 **/
beforeAll(async () => await connectDatabase());

/**
 * Create Admin Session
 */
beforeEach(async () => {
  await generateSession(request, true);
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */

afterAll(async () => {
  await closeDatabase();
  await emptyUploadFolders();
});

describe("Event Model Test", () => {
  it("CREATE - should create & save Topic successfully", async () => {
    const topicRes = await generateTopic(request);
    const topic = topicRes.body.data.addTopic;

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
      mutation {
        addTopic(
          name: "testTopic"
          randomField: "random"
          description: "testTopicDescription"
          keywords: [ "${keywordID}", "${keywordID}"]
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

    const res = await request.post("/graphql").send({
      query,
    });
    expect(res.body.errors).toBeDefined();
  });

  it("CREATE - should fail create Topic without required field", async () => {
    const keywordRes = await generateKeyword(request);
    const keywordID = keywordRes.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation {
        addTopic(description: "testTopicDescription", keywords: [ "${keywordID}", "${keywordID}"]) {
          name
          id
          description
          keywords {
            name
          }
        }
      }
    `;

    const res = await request.post("/graphql").send({
      query,
    });
    expect(res.body.errors).toBeDefined();
  });

  it("CREATE - should fail create & save topic without being logged in", async () => {
    request.jar = new CookieJar();
    try {
      await generateTopic(request);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("CREATE - should fail create & save topic without being an admin", async () => {
    await generateSession(request);
    try {
      await generateTopic(request);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("GET - should all the topics", async () => {
    await generateTopic(request);
    await generateTopic(request);

    const query = /* GraphQL */ `
      {
        topics {
          id
        }
      }
    `;

    const res = await request.post("/graphql").send({
      query,
    });
    expect(res.body.data.topics.length).toBe(2);
  });

  it("GET - should get topic with specific ID", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.body.data!.addTopic.id;
    const query = /* GraphQL */ `
      query {
        topic(id: "${savedTopicID}") {
          id
          name
        }
      }
    `;
    const getRes = await request.post("/graphql").send({
      query,
    });
    expect(getRes.body.data.topic.id).toBe(savedTopicID);
  });

  it("UPDATE - should update topic successfully", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.body.data!.addTopic.id;
    const query = /* GraphQL */ `
      mutation {
          updateTopic(id: "${savedTopicID}", name: "amazing") {
          name
          id
        }
      }
    `;
    const updateRes = await request.post("/graphql").send({
      query,
    });
    expect(updateRes.body.data!.updateTopic.name).toBe("amazing");
  });

  it("UPDATE - should fail to update topic without being admin", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.body.data!.addTopic.id;
    const query = /* GraphQL */ `
      mutation {
          updateTopic(id: "${savedTopicID}", name: "amazing") {
          name
          id
        }
      }
    `;

    await generateSession(request);

    const updateRes = await request.post("/graphql").send({
      query,
    });
    expect(updateRes.body.errors[0].status).toBe(401);
    expect(updateRes.body.data.updateTopic).toBeNull();
  });

  it("UPDATE - should fail to update topic without being logged in", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.body.data!.addTopic.id;
    const query = /* GraphQL */ `
      mutation {
          updateTopic(id: "${savedTopicID}", name: "amazing") {
          name
          id
        }
      }
    `;

    request.jar = new CookieJar();

    const updateRes = await request.post("/graphql").send({
      query,
    });

    expect(updateRes.body.errors[0].status).toBe(401);
    expect(updateRes.body.data.updateTopic).toBeNull();
  });

  it("DELETE - should delete topic successfully", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.body.data!.addTopic.id;
    const query = /* GraphQL */ `
      mutation {
        deleteTopic(id: "${savedTopicID}") {
          name
          id
        }
      }
    `;

    await request.post("/graphql").send({
      query,
    });
    const topic = Topic.findById(savedTopicID);
    expect(topic).toBeUndefined;
  });

  it("DELETE - should fail to delete topic without being logged in", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.body.data!.addTopic.id;
    const query = /* GraphQL */ `
      mutation {
        deleteTopic(id: "${savedTopicID}") {
          name
          id
        }
      }
    `;

    request.jar = new CookieJar();

    const deleteRes = await request.post("/graphql").send({
      query,
    });

    const topic = Topic.findById(savedTopicID);
    expect(deleteRes.body.errors[0].status).toBe(401);
    expect(topic).toBeDefined;
  });

  it("DELETE - should delete topic without being admin", async () => {
    const res = await generateTopic(request);
    const savedTopicID = res.body.data!.addTopic.id;
    const query = /* GraphQL */ `
      mutation {
        deleteTopic(id: "${savedTopicID}") {
          name
          id
        }
      }
    `;

    await generateSession(request);

    const deleteRes = await request.post("/graphql").send({
      query,
    });

    const topic = Topic.findById(savedTopicID);
    expect(deleteRes.body.errors[0].status).toBe(401);
    expect(topic).toBeDefined;
  });
});
