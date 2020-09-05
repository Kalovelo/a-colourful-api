import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
  GraphQLInputFieldMap,
  GraphQLInputType,
} from "graphql";
import { TopicType, TopicMutations } from "./Topic";
import Topic from "../models/Topic";
import { KeywordType } from "./Keyword";
import Keyword from "../models/Keyword";
import Event from "../models/Event";
import { keywordMutations } from "./Keyword";
import { EventType, eventMutations } from "./Event";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    topics: {
      type: new GraphQLList(TopicType),
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Topic.find();
      },
    },
    topic: {
      type: TopicType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Topic.findById(args.id);
      },
    },
    keywords: {
      type: new GraphQLList(KeywordType),
      resolve(parent, args) {
        return Keyword.find();
      },
    },
    keyword: {
      type: KeywordType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Keyword.findById(args.id);
      },
    },
    event: {
      type: EventType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Event.findById(args.id);
      },
    },
    events: {
      type: EventType,
      async resolve(parent, args) {
        return await Event.find();
      },
    },
  },
});

const mutations = { ...keywordMutations, ...TopicMutations, ...eventMutations } as any;

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: { ...mutations },
});

const RootQuerySchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default RootQuerySchema;
