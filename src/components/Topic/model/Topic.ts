import mongoose, { Schema, Document } from "mongoose";

export interface TopicDocument extends Document {
  name: string;
  description?: string;
  keywords: [string];
}

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

const Topic = mongoose.model<TopicDocument>("Topic", TopicSchema);
export default Topic;
