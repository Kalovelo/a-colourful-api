import mongoose, { Schema, Mongoose, Model, Document } from "mongoose";

export interface KeywordDocument extends Document {
  name: string;
  svg: string;
}
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

const Keyword = mongoose.model<KeywordDocument>("Keyword", KeywordSchema);
export default Keyword;
