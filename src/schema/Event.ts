import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from "graphql";
import { TopicType } from "./Topic";
import { CheatSheetType as CheatSheetSchema, CheatSheetInput } from "./Cheatsheet";
import Event, { EventDocument } from "../models/Event";
import { uploadFileGraphQL } from "../middleware/fileManager";
import Topic from "../models/Topic";

const { GraphQLUpload } = require("graphql-upload");

const CodeSnippetSchema = new GraphQLObjectType({
  name: "CodeSnippet",
  fields: () => ({
    id: { type: GraphQLString },
    commands: { type: new GraphQLList(GraphQLString) },
  }),
});

const CodeSnippetInput = new GraphQLInputObjectType({
  name: "CodeSnippetInput",
  fields: () => ({
    id: { type: GraphQLString },
    commands: { type: new GraphQLList(GraphQLString) },
  }),
});

const LinkSchema = new GraphQLObjectType({
  name: "link",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    link: {
      type: GraphQLString,
    },
  }),
});

const LinkInput = new GraphQLInputObjectType({
  name: "linkInput",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    link: {
      type: GraphQLString,
    },
  }),
});

const ArrayLinkSchema = new GraphQLObjectType({
  name: "ArrayLink",
  fields: () => ({
    name: { type: GraphQLString },
    links: {
      type: new GraphQLList(LinkSchema),
    },
  }),
});

const ArrayLinkInput = new GraphQLInputObjectType({
  name: "ArrayLinkInput",
  fields: () => ({
    name: { type: GraphQLString },
    links: {
      type: new GraphQLList(LinkInput),
    },
  }),
});

const eventTypeEnum = new GraphQLEnumType({
  name: "eventTypeEnum",
  values: {
    TALK: { value: "Talk" },
    WORKSHOP: { value: "Workshop" },
  },
});

const eventLevelEnum = new GraphQLEnumType({
  name: "eventLevelEnum",
  values: {
    BEGINNER: { value: "Beginner" },
    INTERMEDIATE: { value: "Intermediate" },
  },
});

export const EventType = new GraphQLObjectType({
  name: "Event",
  fields: () => ({
    id: { type: GraphQLID! },
    name: { type: GraphQLString! },
    description: { type: GraphQLString! },
    eventType: { type: eventTypeEnum },
    summary: { type: GraphQLString! },
    date: { type: GraphQLString! },
    place: { type: GraphQLString! },
    poster: { type: GraphQLString! },
    primaryImage: { type: GraphQLString! },
    type: {
      type: eventTypeEnum!,
    },
    level: {
      type: eventLevelEnum!,
    },
    topic: {
      type: TopicType!,
      async resolve(parent, args) {
        const topic = await Topic.findById(parent.topic);
        return topic;
      },
    },
    cheatsheet: { type: CheatSheetSchema },
    codesnippets: {
      type: new GraphQLList(CodeSnippetSchema),
    },
    images: { type: new GraphQLList(GraphQLString) },
    arrayLinks: { type: ArrayLinkSchema },
    fileArray: { type: ArrayLinkSchema },
  }),
});

const uploadImage = async (image: any) => {
  const { filename, mimetype, encoding, createReadStream } = await image;
  const stream = createReadStream();
  return (await uploadFileGraphQL(stream, filename, mimetype)) as string;
};

const addEvent = {
  type: EventType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString)! },
    eventType: { type: new GraphQLNonNull(eventTypeEnum)! },
    topic: { type: new GraphQLNonNull(GraphQLID)! },
    description: { type: GraphQLString! },
    summary: { type: GraphQLString! },
    date: { type: GraphQLString! },
    level: { type: new GraphQLNonNull(GraphQLString)! },
    place: { type: new GraphQLNonNull(GraphQLString)! },
    poster: { type: GraphQLUpload! },
    primaryImage: { type: GraphQLUpload! },
    images: { type: new GraphQLList(GraphQLUpload)! },
    cheatsheet: { type: CheatSheetInput },
    codeSnippets: { type: new GraphQLList(CodeSnippetInput)! },
    arrayLink: { type: new GraphQLList(ArrayLinkInput)! },
    fileArray: { type: ArrayLinkInput! },
  },

  async resolve(parent: EventDocument, args: any) {
    let { images, poster, primaryImage, ...rest } = args;
    images = await args.images.map(async (image: any) => uploadImage(image));
    poster = await uploadImage(args.poster);
    primaryImage = await uploadImage(args.primaryImage);

    const event = await Event.create({
      images,
      poster,
      primaryImage,
      ...rest,
    });

    return event;
  },
};

export const eventMutations = { addEvent };
