import { EventType, eventTypeEnum } from "./Event";
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";
import Event, { EventDocument } from "../../models/Event";
import { CheatSheetInput } from "./Cheatsheet";
import { bulkUpload, uploadFile, bulkDelete } from "../../middleware/fileManager";

const { GraphQLUpload } = require("graphql-upload");

const ArrayLinkInput = new GraphQLInputObjectType({
  name: "ArrayLinkInput",
  fields: () => ({
    name: { type: GraphQLString },
    links: {
      type: new GraphQLList(LinkInput),
    },
  }),
});

const CodeSnippetInput = new GraphQLInputObjectType({
  name: "CodeSnippetInput",
  fields: () => ({
    id: { type: GraphQLString },
    commands: { type: new GraphQLList(GraphQLString) },
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
    images = await bulkUpload(args.images);
    poster = await uploadFile(args.poster);
    primaryImage = await uploadFile(args.primaryImage);
    const event = await Event.create({
      images,
      poster,
      primaryImage,
      ...rest,
    });

    return event;
  },
};

const updateEvent = {
  type: EventType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: { type: GraphQLString! },
    eventType: { type: eventTypeEnum! },
    topic: { type: GraphQLID! },
    description: { type: GraphQLString! },
    summary: { type: GraphQLString! },
    date: { type: GraphQLString! },
    level: { type: GraphQLString! },
    place: { type: GraphQLString! },
    cheatsheet: { type: CheatSheetInput },
    codeSnippets: { type: new GraphQLList(CodeSnippetInput)! },
    arrayLink: { type: new GraphQLList(ArrayLinkInput)! },
    fileArray: { type: ArrayLinkInput! },
    poster: { type: GraphQLUpload! },
    primaryImage: { type: GraphQLUpload! },
    images: { type: new GraphQLList(GraphQLUpload)! },
  },

  async resolve(parent: EventDocument, args: any) {
    if (args.images) args.images = await bulkUpload(args.images);
    if (args.poster) args.poster = await uploadFile(args.poster);
    if (args.primaryImage) args.primaryImage = await uploadFile(args.primaryImage);
    return await Event.findByIdAndUpdate(args.id, args, {
      new: true,
      runValidators: true,
    });
  },
};

const deleteEvent = {
  type: EventType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(parent: EventDocument, args: any) {
    const event = await Event.findByIdAndDelete(args.id);
    await bulkDelete([event!.primaryImage, event!.poster, ...event!.images]);
    return event;
  },
};

export const mutations = { addEvent, updateEvent, deleteEvent };
