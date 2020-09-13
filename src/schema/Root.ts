import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema } from "graphql";
import Event from "../models/Event";
import Keyword from "../models/Keyword";
import Topic from "../models/Topic";
import User from "../models/User";
import GraphqlHTTPError from "../utils/GraphqlHTTPError";
import { EventType } from "./Event/Event";
import { mutations as eventMutations } from "./Event/Mutations";
import { keywordMutations, KeywordType } from "./Keyword";
import { TopicMutations, TopicType } from "./Topic";
import { UserMutations } from "./User/Mutations";
import { UserType } from "./User/User";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    me: {
      type: UserType,
      async resolve(_, __, { req }) {
        if (!req.userId) throw new GraphqlHTTPError("UserID not found", 404);
        return User.findById(req.userId);
      },
    },
    topics: {
      type: new GraphQLList(TopicType),
      args: { id: { type: GraphQLID } },
      async resolve(_, __) {
        return await Topic.find();
      },
    },
    topic: {
      type: TopicType,
      args: { id: { type: GraphQLID } },
      async resolve(_, args) {
        return await Topic.findById(args.id);
      },
    },
    keywords: {
      type: new GraphQLList(KeywordType),
      resolve(_, __) {
        return Keyword.find();
      },
    },
    keyword: {
      type: KeywordType,
      args: { id: { type: GraphQLID } },
      async resolve(_, args) {
        return await Keyword.findById(args.id);
      },
    },
    event: {
      type: EventType,
      args: { id: { type: GraphQLID } },
      async resolve(_, args) {
        return await Event.findById(args.id);
      },
    },
    events: {
      type: new GraphQLList(EventType),
      async resolve(_, __) {
        return Event.find();
      },
    },
  },
});

const mutations = {
  ...keywordMutations,
  ...TopicMutations,
  ...eventMutations,
  ...UserMutations,
} as any;

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: { ...mutations },
});

const RootQuerySchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default RootQuerySchema;
