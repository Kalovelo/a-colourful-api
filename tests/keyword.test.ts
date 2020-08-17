import Keyword from "../src/models/Keyword";
const mongoose = require("mongoose");
const sampleSVG = require("./files/sample.svg");

describe("Keyword Model Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useCreateIndex: true },
      (err: Error) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  it("should create & save keyword successfully", async () => {
    const keywordData = { name: "amazing", description: "aha aha", svg: sampleSVG };
    const savedKeyword = await (await new Keyword(keywordData)).save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedKeyword._id).toBeDefined();
    expect(savedKeyword.name).toBe(keywordData.name);
    expect(savedKeyword.svg).toBe(keywordData.svg);
  });

  it("should fail create keyword with unknown field", async () => {
    let err;
    const savedKeywordwithRandomField = await ((await new Keyword({
      name: "stoe",
      random: "aaaa",
      svg: sampleSVG,
    })) as any).save();
    expect(savedKeywordwithRandomField.random).toBeUndefined();
    expect(savedKeywordwithRandomField.name).toBeDefined();
  });

  it("should fail create keyword without required field", async () => {
    let err;
    try {
      const savedKeywordWithoutRequiredField = await (
        await new Keyword({
          svg: sampleSVG,
        })
      ).save();
      let err = savedKeywordWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });
});
