import { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLSchema } from "graphql";
import { TopicType } from "./Topic";
import Topic from "../models/Topic";
import { KeywordType } from "./Keyword";
import Keyword from "../models/Keyword";
import { keywordMutations } from "./Keyword";

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
      args: { id: { type: GraphQLID } },
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
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: { ...keywordMutations },
});

const RootQuerySchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default RootQuerySchema;
