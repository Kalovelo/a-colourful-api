const mongoose = require("mongoose");
const Schema = mongoose.Schema;

CommandSchema = newSchema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

CheatSheetCommandBlockSchema = newSchema({
  name: { type: String, required: true },
  commands: [CommandSchema],
});

StageSchema = newSchema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

CheatSheetSchema = newSchema({
  commandBlocks: [CheatSheetCommandBlockSchema],
  stages: [StageSchema],
});

const CheatSheet = mongoose.model("cheatsheet", CheatSheetSchema);

module.exports = CheatSheet;
