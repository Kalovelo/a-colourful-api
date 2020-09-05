import mongoose, { Schema, Document } from "mongoose";
export interface EventDocument extends Document {
  name: string;
  eventType: string;
  topic: string;
  description: string;
  summary: string;
  date: Date;
  level: string;
  place: string;
  poster: string;
  primaryImage: string;
  images: [string];
  cheatsheet: string;
  codeSnippets: [
    {
      name: string;
      commands: [string];
    }
  ];
  arrayLink: [{ name: string; links: [{ name: string; link: string }] }];
  fileArray: { name: string; links: [{ name: string; link: string }] };
}

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
    enum: ["workshop", "talk"],
  },
  topic: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Topic",
    required: [true, "Topic is required"],
  },
  description: {
    type: String,
  },
  summary: {
    type: String,
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
    data: Buffer,
    contentType: String,
  },
  primaryImage: {
    data: Buffer,
    contentType: String,
  },
  cheatsheet: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "CheatSheet",
  },
  codesnippets: [CodeSnippetSchema],
  images: [{ data: Buffer, contentType: String }],
  arrayLinks: [ArrayLink],
  fileArray: ArrayLink,
});

const Event = mongoose.model<EventDocument>("event", EventSchema);
export default Event;
