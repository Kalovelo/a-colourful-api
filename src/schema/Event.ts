import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLEnumType, GraphQLID } from "graphql";
import { TopicType } from "./Topic";
import { CheatSheetType as CheatSheetSchema } from "./Cheatsheet";

const CodeSnippetSchema = new GraphQLObjectType({
  name: "Code Snippet",
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

const eventTypeEnum = new GraphQLEnumType({
  name: "event type enum",
  values: {
    TALK: { value: "talk" },
    WORKSHOP: { value: "workshop" },
  },
});

const eventLevelEnum = new GraphQLEnumType({
  name: "event level enum",
  values: {
    BEGINNER: { value: "beginner" },
    INTERMEDIATE: { value: "intermediate" },
  },
});

export const EventType = new GraphQLObjectType({
  name: "Event",
  fields: () => ({
    id: { type: GraphQLID! },
    name: { type: GraphQLString! },
    description: { type: GraphQLString! },
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
    topic: { type: TopicType! },
    cheatsheet: { type: CheatSheetSchema },
    codesnippets: {
      type: new GraphQLList(CodeSnippetSchema),
    },
    images: { type: new GraphQLList(GraphQLString) },
    arrayLinks: { type: ArrayLinkSchema },
    fileArray: { type: ArrayLinkSchema },
  }),
});
