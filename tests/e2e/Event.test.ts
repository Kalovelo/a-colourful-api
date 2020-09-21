import supertest from "supertest";
import { closeDatabase, connectDatabase, clearDatabase } from "../dbhandler";
import { graphql } from "graphql";
import { generateTopic, generateEvent, generateSession } from "./generateData";
import { graphqlRequestUpload } from "../graphqlRequestUpload";
import { CookieJar } from "cookiejar";
import { emptyUploadFolders } from "../fileHandler";
import Event from "../../src/components/Event/model/Event";
import RootQuerySchema from "../../src/components/Root";
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
  it("CREATE - should create & save Event successfully", async () => {
    const eventRes = await generateEvent(request);
    const event = eventRes.body.data.addEvent;
    expect(event.id).toBeDefined();
    expect(event.name).toBe("testEvent");
  });

  it("CREATE - should fail create & save Event without being logged in", async () => {
    request.jar = new CookieJar();
    try {
      await generateEvent(request);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("CREATE - should fail create & save topic without being admin", async () => {
    await generateSession(request);
    try {
      await generateEvent(request);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("CREATE - should fail create Event unknown field", async () => {
    const TopicRes = await generateTopic(request);
    const tid = TopicRes.body.data!.addTopic.id;

    const query = /* GraphQL */ `
    mutation($primaryImage: Upload, $images: [Upload], $poster: Upload) {
      addEvent(
        name: "testEvent"
        topic: "${tid}"
        random: "random"
        poster: $poster
        date: "10/10/2010"
        images: $images
        primaryImage: $primaryImage
        eventType: TALK
        description: "testEvent Description"
        summary: "testEvent Summary"
        level: "Beginner"
        place: "SKG"
        cheatsheet: {
          commandBlocks: {
            name: "lalala"
            commands: { name: "command 1", description: "description" }
          }
          stages: [{ name: "stageName", description: "stageDesc" }]
        }
        codeSnippets: [{ commands: ["sudo pkill myself"] }]
        arrayLink: [{ name: "arrayLink", links: [{ name: "link1", link: "url" }] }]
        fileArray: { name: "fileArray", links: [{ name: "fileLink1", link: "fileURL" }] }
      ) {
        id
        name
      }
    }
  `;

    const res = await graphqlRequestUpload(query, request, {
      topicID: tid,
      poster: "tests/files/sample.svg",
      primaryImage: "tests/files/sample.svg",
      images: ["tests/files/sample.svg"],
    });
    expect(res.status).toBe(400);
  });

  it("CREATE - should fail create Event undefined topic", async () => {
    const TopicRes = await generateTopic(request);
    const tid = TopicRes.body.data!.addTopic.id;

    const query = /* GraphQL */ `
      mutation($primaryImage: Upload, $images: [Upload], $poster: Upload) {
        addEvent(
          name: "testEvent"
          topic: "5f4bebf2d98d5b27b68b4zzz"
          poster: $poster
          date: "10/10/2010"
          images: $images
          primaryImage: $primaryImage
          eventType: TALK
          description: "testEvent Description"
          summary: "testEvent Summary"
          level: "Beginner"
          place: "SKG"
          cheatsheet: {
            commandBlocks: {
              name: "lalala"
              commands: { name: "command 1", description: "description" }
            }
            stages: [{ name: "stageName", description: "stageDesc" }]
          }
          codeSnippets: [{ commands: ["sudo pkill myself"] }]
          arrayLink: [{ name: "arrayLink", links: [{ name: "link1", link: "url" }] }]
          fileArray: { name: "fileArray", links: [{ name: "fileLink1", link: "fileURL" }] }
        ) {
          id
          name
        }
      }
    `;

    const res = await graphqlRequestUpload(query, request, {
      poster: "tests/files/sample.svg",
      primaryImage: "tests/files/sample.svg",
      images: ["tests/files/sample.svg"],
    });

    expect(res.body.data.addEvent).toBeNull();
  });

  it("CREATE - should fail create Event without required field", async () => {
    const TopicRes = await generateTopic(request);
    const tid = TopicRes.body.data!.addTopic.id;

    const query = /* GraphQL */ `
    mutation($primaryImage: Upload, $images: [Upload], $poster: Upload) {
      addEvent(
        topic: "${tid}"
        random: "random"
        poster: $poster
        images: $images
        primaryImage: $primaryImage
        eventType: TALK
        description: "testEvent Description"
        summary: "testEvent Summary"
        level: "Beginner"
        place: "SKG"
        cheatsheet: {
          commandBlocks: {
            name: "lalala"
            commands: { name: "command 1", description: "description" }
          }
          stages: [{ name: "stageName", description: "stageDesc" }]
        }
        codeSnippets: [{ commands: ["sudo pkill myself"] }]
        arrayLink: [{ name: "arrayLink", links: [{ name: "link1", link: "url" }] }]
        fileArray: { name: "fileArray", links: [{ name: "fileLink1", link: "fileURL" }] }
      ) {
        id
        name
      }
    }
  `;

    const res = await graphqlRequestUpload(query, request, {
      topicID: tid,
      poster: "tests/files/sample.svg",
      primaryImage: "tests/files/sample.svg",
      images: ["tests/files/sample.svg"],
    });

    expect(res.status).toBe(400);
  });

  it("GET - should all the events", async () => {
    await generateEvent(request);
    await generateEvent(request);

    const query = /* GraphQL */ `
      {
        events {
          id
        }
      }
    `;

    const res = await request.post("/graphql").send({
      query,
    });
    expect(res.body.data!.events.length).toBe(2);
  });

  it("GET - should get event with specific ID", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      query {
        event(id: "${savedEventID}") {
          id
          name
        }
      }
    `;

    const getRes = await request.post("/graphql").send({
      query,
    });
    expect(getRes.body.data!.event.id).toBe(savedEventID);
  });

  it("UPDATE - should update & save event successfully", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      mutation {
        updateEvent(id: "${savedEventID}", name: "amazing") {
          name
          id
        }
      }
    `;

    const updateRes = await request.post("/graphql").send({
      query,
    });

    expect(updateRes.body.data!.updateEvent.name).toBe("amazing");
  });

  it("UPDATE - should fail to update event without being logged in", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      mutation {
        updateEvent(id: "${savedEventID}", name: "amazing") {
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
  });

  it("UPDATE - should fail to update event without being an admin", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      mutation {
        updateEvent(id: "${savedEventID}", name: "amazing") {
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
  });

  it("UPDATE - should fail update event with unknown topic", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      mutation {
        updateEvent(id: "${savedEventID}", name: "amazing", topic: "5f4bebf2d98d5b27b68b4zzz") {
          name
          id
        }
      }
    `;

    const updateRes = await request.post("/graphql").send({
      query,
    });

    expect(updateRes.body.data!.updateEvent).toBeNull();
  });

  it("DELETE - should delete event successfully", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      mutation($EventID: ID!) {
        deleteEvent(id: $EventID) {
          name
          id
          svg
        }
      }
    `;

    await graphql(RootQuerySchema, query, null, null, {
      EventID: savedEventID,
    });
    const event = Event.findById(savedEventID);
    expect(event).toBeUndefined;
  });

  it("DELETE - should fail to delete event without being logged in", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      mutation {
        deleteEvent(id: "${savedEventID}") {
          name
          id
        }
      }
    `;

    request.jar = new CookieJar();

    const deleteRes = await request.post("/graphql").send({
      query,
    });

    const event = Event.findById(savedEventID);
    expect(deleteRes.body.errors[0].status).toBe(401);
    expect(event).toBeDefined;
  });

  it("DELETE - should fail to delete event without being an admin", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      mutation {
        deleteEvent(id: "${savedEventID}") {
          name
          id
        }
      }
    `;

    await generateSession(request);

    const deleteRes = await request.post("/graphql").send({
      query,
    });

    const event = Event.findById(savedEventID);
    expect(deleteRes.body.errors[0].status).toBe(401);
    expect(event).toBeDefined;
  });
});
