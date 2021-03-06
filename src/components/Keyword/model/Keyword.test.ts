import mongoose from "mongoose";
import { closeDatabase, connectDatabase, clearDatabase } from "../../../../tests/dbhandler";
import Keyword from "./Keyword";

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
    const savedKeyword = await ((await new Keyword({
      name: "newName",
      svg: sampleSVG,
    })) as any).save();
    expect(savedKeyword._id).toBeDefined();
    expect(savedKeyword.name).toBeDefined();
    expect(savedKeyword.svg).toBeDefined();
  });

  it("should fail create keyword unknown field", async () => {
    const savedKeywordwithRandomField = await ((await new Keyword({
      name: "newName",
      random: "aaaa",
      svg: sampleSVG,
    })) as any).save();
    expect(savedKeywordwithRandomField.random).toBeUndefined();
    expect(savedKeywordwithRandomField.name).toBeDefined();
  });

  it("should fail create keyword without required field", async () => {
    let err;
    try {
      await (
        await new Keyword({
          name: "name",
        })
      ).save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    const keyword = await Keyword.findOne({ name: "name" });
    expect(keyword?._id).toBeUndefined();
  });

  it("should update keyword name", async () => {
    const savedKeyword = await ((await new Keyword({
      name: "newName",
      svg: sampleSVG,
    })) as any).save();
    const savedKeywordID = savedKeyword._id;

    const updatedKeyword = await Keyword.findOneAndUpdate(
      { _id: savedKeywordID },
      { name: "new name" },
      { new: true, runValidators: true }
    );

    expect(updatedKeyword!.name).toBe("new name");
  });
});
