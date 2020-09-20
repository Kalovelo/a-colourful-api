import mongoose, { Schema } from "mongoose";
import { CheatSheetSchema } from "./CheatSheet";
import { EventDocument } from "./interface";

const CodeSnippetSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  commands: { type: String, required: [true, "command is required"] },
});

const ArrayLink = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  links: [
    {
      name: {
        type: String,
        required: [true, "Arraylink's link name field is required"],
      },
      link: {
        type: String,
        required: [true, "Arraylink's link is required"],
      },
    },
  ],
});

const EventSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  eventType: {
    type: String,
    required: true,
    enum: ["Workshop", "Talk"],
  },
  topic: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Topic",
    required: [true, "Topic is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  summary: {
    type: String,
    required: [true, "Summary is required"],
  },
  date: {
    type: Date,
    required: [true, "An event date is required"],
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate"],
  },
  place: {
    type: String,
    required: [true, "Place is required"],
  },
  poster: {
    type: String,
  },
  primaryImage: {
    type: String,
  },
  cheatsheet: {
    type: [CheatSheetSchema],
  },
  codesnippets: [CodeSnippetSchema],
  images: [String],
  arrayLinks: [ArrayLink],
  fileArray: ArrayLink,
});

const Event = mongoose.model<EventDocument>("Event", EventSchema);
export default Event;
