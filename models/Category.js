const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KeywordSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  svg: {
    type: Buffer,
    required: [true, "A keyword needs an image"],
  },
});

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  keywords: [KeywordSchema],
});

const Category = mongoose.model("category", CategorySchema);

module.exports = Category;
