import { Document } from "mongoose";

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
  images: [string] | any;
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
