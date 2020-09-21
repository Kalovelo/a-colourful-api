import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from "graphql";
import { KeywordType } from "../../Keyword/controller/Keyword";
import Keyword from "../../Keyword/model/Keyword";
import Topic, { TopicDocument } from "../model/Topic";
import GraphqlHTTPError from "../../../utils/GraphqlHTTPError";
import {
  addTopic as addTopicService,
  updateTopic as updateTopicService,
  deleteTopic as deleteTopicService,
} from "../service/service";

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

const addTopic = {
  type: TopicType,
  args: {
    name: { type: GraphQLString! },
    description: { type: new GraphQLNonNull(GraphQLString) },
    keywords: { type: new GraphQLNonNull(GraphQLList(GraphQLID)) },
  },
  async resolve(_: TopicDocument, args: TopicDocument, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    return addTopicService(args);
  },
};

const updateTopic = {
  type: TopicType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    keywords: { type: GraphQLList(GraphQLID) },
  },
  async resolve(_: TopicDocument, args: any, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    return updateTopicService(args);
  },
};

const deleteTopic = {
  type: TopicType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(_: TopicDocument, { id }: { id: string }, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    deleteTopicService(id);
  },
};

export const TopicMutations = { addTopic, updateTopic, deleteTopic };
