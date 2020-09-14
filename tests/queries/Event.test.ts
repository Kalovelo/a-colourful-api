import supertest from "supertest";
import { closeDatabase, connectDatabase, clearDatabase } from "../dbhandler";
import { graphql } from "graphql";
import RootQuerySchema from "../../src/schema/Root";
import { generateTopic, generateEvent } from "./generateData";
import Event from "../../src/models/Event";
import { graphqlRequestUpload } from "../graphqlRequestUpload";
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

describe("Event Model Test", () => {
  it("CREATE - should create & save Event successfully", async () => {
    const eventRes = await generateEvent(request);
    const event = eventRes.body.data.addEvent;
    expect(event.id).toBeDefined();
    expect(event.name).toBe("testEvent");
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
      images: ["tests/files/sample.svg", "tests/files/sample.svg"],
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
          topic: "5f4bebf2d98d5b27b68b48c6"
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
      images: ["tests/files/sample.svg", "tests/files/sample.svg"],
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
      images: ["tests/files/sample.svg", "tests/files/sample.svg"],
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

  it("UPDATE - should create & save event successfully", async () => {
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

  it("UPDATE - should fail update event with unknown topic", async () => {
    const res = await generateEvent(request);
    const savedEventID = res.body.data.addEvent.id;
    const query = /* GraphQL */ `
      mutation {
        updateEvent(id: "${savedEventID}", name: "amazing", topic: "5f4bebf2d98d5b27b68b48c6") {
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
});
