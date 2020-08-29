import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from "graphql";
import { KeywordType } from "./Keyword";
import Keyword from "../models/Keyword";
import Topic from "../models/Topic";

export const TopicType = new GraphQLObjectType({
  name: "Topic",
  fields: () => ({
    id: { type: GraphQLID! },
    name: { type: GraphQLString! },
    description: { type: GraphQLString! },
    keywords: {
      type: new GraphQLList(KeywordType)!,
      async resolve(parent, args) {
        const topic = await Topic.findById(parent.id);
        const keywords = await (await Keyword.find()).filter((keyword) =>
          topic!.keywords.includes(keyword._id)
        );
        return keywords;
      },
    },
  }),
});
