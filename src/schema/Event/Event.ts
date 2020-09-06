import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLEnumType, GraphQLID } from "graphql";
import { TopicType } from "../Topic";
import { CheatSheetType as CheatSheetSchema } from "../Cheatsheet";
import Topic from "../../models/Topic";

const CodeSnippetSchema = new GraphQLObjectType({
  name: "CodeSnippet",
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

const ArrayLinkSchema = new GraphQLObjectType({
  name: "ArrayLink",
  fields: () => ({
    name: { type: GraphQLString },
    links: {
      type: new GraphQLList(LinkSchema),
    },
  }),
});

export const eventTypeEnum = new GraphQLEnumType({
  name: "eventTypeEnum",
  values: {
    TALK: { value: "Talk" },
    WORKSHOP: { value: "Workshop" },
  },
});

export const eventLevelEnum = new GraphQLEnumType({
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
