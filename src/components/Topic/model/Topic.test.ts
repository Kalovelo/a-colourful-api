import mongoose from "mongoose";
import { clearDatabase, closeDatabase, connectDatabase } from "../../../../tests/dbhandler";
import Topic from "./Topic";

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

describe("Topic Model Test", () => {
  it("should create & save topic successfully", async () => {
    const savedTopic = await ((await new Topic({
      name: "newName",
      description: "aaaa",
    })) as any).save();
    expect(savedTopic._id).toBeDefined();
    expect(savedTopic.name).toBeDefined();
  });

  it("should fail create topic unknown field", async () => {
    const savedTopicwithRandomField = await ((await new Topic({
      name: "newName",
      description: "description here",
      random: "aaaa",
    })) as any).save();
    expect(savedTopicwithRandomField.random).toBeUndefined();
    expect(savedTopicwithRandomField.name).toBeDefined();
  });

  it("should fail create topic without required field", async () => {
    let err;
    try {
      await (await new Topic({ description: "lala" })).save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    const topic = await Topic.findOne({ description: "lala" });
    expect(topic?._id).toBeUndefined();
  });

  it("should update topic name", async () => {
    const savedTopic = await ((await new Topic({
      name: "newName",
      description: "description",
      keywords: [mongoose.Types.ObjectId()],
    })) as any).save();
    const savedTopicID = savedTopic._id;

    const updatedTopic = await Topic.findOneAndUpdate(
      { _id: savedTopicID },
      { name: "new name" },
      { new: true, runValidators: true }
    );
    expect(updatedTopic!.name).toBe("new name");
  });

  it("should not update topic unknown field", async () => {
    const savedTopic = await ((await new Topic({
      name: "newName",
      description: "description",
      keywords: [mongoose.Types.ObjectId()],
    })) as any).save();
    const savedTopicID = savedTopic._id;

    const updatedTopic = await Topic.findOneAndUpdate(
      { _id: savedTopicID },
      { randomField: "random" },
      { new: true, runValidators: true }
    );

    expect((updatedTopic as any)!.randomField).toBeUndefined();
  });
});
