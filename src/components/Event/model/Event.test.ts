import mongoose from "mongoose";
import { clearDatabase, closeDatabase, connectDatabase } from "../../../../tests/dbhandler";
import Event from "./Event";

const sampleSVG = require("../../../../tests/files/sample.svg");

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
  it("should create & save keyword successfully", async () => {
    const event = await ((await new Event({
      name: "testEvent",
      topic: mongoose.Types.ObjectId(),
      poster: sampleSVG,
      date: "10/10/2010",
      images: [sampleSVG, sampleSVG],
      primaryImage: sampleSVG,
      eventType: "Talk",
      description: "testEvent Description",
      summary: "testEvent Summary",
      level: "Beginner",
      place: "SKG",
      cheatsheet: {
        commandBlocks: {
          name: "lalala",
          commands: { name: "command 1", description: "description" },
        },
        stages: [{ name: "stageName", description: "stageDesc" }],
      },
      codeSnippets: [{ commands: ["sudo pkill myself"] }],
      arrayLink: [{ name: "arrayLink", links: [{ name: "link1", link: "url" }] }],
      fileArray: { name: "fileArray", links: [{ name: "fileLink1", link: "fileURL" }] },
    })) as any).save();
    expect(event._id).toBeDefined();
    expect(event.name).toBe("testEvent");
    expect(event.eventType).toBe("Talk");
    expect(event.date).toBeDefined();
    expect(event.description).toBe("testEvent Description");
    expect(event.summary).toBe("testEvent Summary");
    expect(event.level).toBe("Beginner");
    expect(event.place).toBe("SKG");
  });

  it("should fail create event unknown field", async () => {
    const event = await ((await new Event({
      random: "random",
      name: "testEvent",
      topic: mongoose.Types.ObjectId(),
      poster: sampleSVG,
      date: "10/10/2010",
      images: [sampleSVG, sampleSVG],
      primaryImage: sampleSVG,
      eventType: "Talk",
      description: "testEvent Description",
      summary: "testEvent Summary",
      level: "Beginner",
      place: "SKG",
      cheatsheet: {
        commandBlocks: {
          name: "lalala",
          commands: { name: "command 1", description: "description" },
        },
        stages: [{ name: "stageName", description: "stageDesc" }],
      },
      codeSnippets: [{ commands: ["sudo pkill myself"] }],
      arrayLink: [{ name: "arrayLink", links: [{ name: "link1", link: "url" }] }],
      fileArray: { name: "fileArray", links: [{ name: "fileLink1", link: "fileURL" }] },
    })) as any).save();
    expect(event._id).toBeDefined();
    expect(event.random).toBeUndefined();
  });

  it("should fail create event without required field", async () => {
    try {
      const event = await ((await new Event({
        topic: mongoose.Types.ObjectId(),
        poster: sampleSVG,
        date: "10/10/2010",
        images: [sampleSVG, sampleSVG],
        primaryImage: sampleSVG,
        eventType: "Talk",
        description: "testEvent Description",
        summary: "testEvent Summary",
        level: "Beginner",
        place: "SKG",
        cheatsheet: {
          commandBlocks: {
            name: "lalala",
            commands: { name: "command 1", description: "description" },
          },
          stages: [{ name: "stageName", description: "stageDesc" }],
        },
        codeSnippets: [{ commands: ["sudo pkill myself"] }],
        arrayLink: [{ name: "arrayLink", links: [{ name: "link1", link: "url" }] }],
        fileArray: { name: "fileArray", links: [{ name: "fileLink1", link: "fileURL" }] },
      })) as any).save();
    } catch (err) {
      expect(err.message).toBe("Event validation failed: name: Name field is required");
    }
  });

  it("should update keyword name", async () => {
    const event = await ((await new Event({
      random: "random",
      name: "testEvent",
      topic: mongoose.Types.ObjectId(),
      poster: sampleSVG,
      date: "10/10/2010",
      images: [sampleSVG, sampleSVG],
      primaryImage: sampleSVG,
      eventType: "Talk",
      description: "testEvent Description",
      summary: "testEvent Summary",
      level: "Beginner",
      place: "SKG",
      cheatsheet: {
        commandBlocks: {
          name: "lalala",
          commands: { name: "command 1", description: "description" },
        },
        stages: [{ name: "stageName", description: "stageDesc" }],
      },
      codeSnippets: [{ commands: ["sudo pkill myself"] }],
      arrayLink: [{ name: "arrayLink", links: [{ name: "link1", link: "url" }] }],
      fileArray: { name: "fileArray", links: [{ name: "fileLink1", link: "fileURL" }] },
    })) as any).save();

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: event._id },
      { name: "new name" },
      { new: true, runValidators: true }
    );

    expect(updatedEvent!.name).toBe("new name");
  });
});
