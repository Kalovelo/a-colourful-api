import mongoose, { Schema } from "mongoose";

const KeywordSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  svg: {
    type: String,
    required: [true, "A keyword needs an image"],
  },
});

const TopicSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  keywords: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Keyword",
  },
});

const Topic = mongoose.model("Topic", TopicSchema);
export const Keyword = mongoose.model("Keyword", KeywordSchema);
export default Topic;
