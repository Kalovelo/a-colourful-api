import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import GraphqlHTTPError from "../../../utils/GraphqlHTTPError";
import Topic from "../../Topic/model/Topic";
import { EventDocument } from "../model/interface";
import {
  addEvent as addEventService,
  deleteEvent as deleteEventService,
  updateEvent as updateEventService,
} from "../service/service";
import { CheatSheetInput } from "./Cheatsheet";
import { EventType, eventTypeEnum } from "./Event";

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

  async resolve(_: EventDocument, args: EventDocument, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    const topic = await Topic.findById(args.topic);
    if (!topic) throw new GraphqlHTTPError("Topic with specific id not found", 404);
    return addEventService(args);
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

  async resolve(_: EventDocument, args: any, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    return updateEventService(args);
  },
};

const deleteEvent = {
  type: EventType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(_: EventDocument, args: any, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    return deleteEventService(args.id);
  },
};

export const mutations = { addEvent, updateEvent, deleteEvent };
