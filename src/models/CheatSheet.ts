import mongoose, { Schema } from "mongoose";

const CommandSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const CheatSheetCommandBlockSchema: Schema = new Schema({
  name: { type: String, required: true },
  commands: [CommandSchema],
});

const StageSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export const CheatSheetSchema: Schema = new Schema({
  commandBlocks: [CheatSheetCommandBlockSchema],
  stages: [StageSchema],
});

const CheatSheet = mongoose.model("cheatsheet", CheatSheetSchema);

export default CheatSheet;
