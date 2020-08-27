import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { KeywordType } from "./Keyword";
import Keyword from "../models/Keyword";
import Topic from "../models/Topic";

export const TopicType = new GraphQLObjectType({
  name: "Topic",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    keywords: {
      type: new GraphQLList(KeywordType),
      async resolve(parent, args) {
        const topic = await Topic.findById(parent.id);
        return await Keyword.find()
          .where("_id")
          .in(topic!.keywords)
          .catch(() => {
            return null;
          });
      },
    },
  }),
});
