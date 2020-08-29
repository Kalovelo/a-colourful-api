import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLID,
  GraphQLSchema,
} from "graphql";
import { TopicType } from "./Topic";
import Topic from "../models/Topic";
import { KeywordType } from "./Keyword";
import keyword from "../models/Keyword";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    topic: {
      type: TopicType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Topic.findById(args.id);
      },
    },
    keywords: {
      type: KeywordType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await keyword.find();
      },
    },
  },
});

const RootQuerySchema = new GraphQLSchema({
  query: RootQuery,
});

export default RootQuerySchema;
