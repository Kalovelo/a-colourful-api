import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from "graphql";
import { KeywordType } from "./Keyword";
import Keyword from "../models/Keyword";
import Topic, { TopicDocument } from "../models/Topic";
import GraphqlHTTPError from "../utils/GraphqlHTTPError";

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
  async resolve(parent: TopicDocument, args: any) {
    try {
      const keywords = await Keyword.find()
        .where("_id")
        .in(args.keywords)
        .catch(() => {
          return null;
        });
      if (!keywords) throw new GraphqlHTTPError("No keyword was found.", 400);

      const topic = await Topic.create({
        name: args.name,
        description: args.description,
        keywords: keywords,
      });

      return topic;
    } catch (err) {
      throw new GraphqlHTTPError(err.message, 400);
    }
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
  async resolve(parent: TopicDocument, args: any, { req }: any) {
    try {
      if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);

      let data: {
        name?: string;
        description?: String;
        keywords?: string[] | string | null;
      } = {};
      if (args.name) data.name = args.name;
      if (args.description) data.description = args.description;
      if (args.keywords) {
        const keywords = await Keyword.find()
          .where("_id")
          .in(args.keywords)
          .catch(() => {
            return null;
          });
        data.keywords = keywords;
        if (!keywords) throw new GraphqlHTTPError("Keywords not found", 404);
      }
      const topic = await Topic.findOneAndUpdate({ _id: args.id }, data as TopicDocument, {
        new: true,
        runValidators: true,
      });
      if (!topic) throw new GraphqlHTTPError("Topic ID not found.", 404);
      return topic;
    } catch (err) {
      throw new GraphqlHTTPError(err.message, 400);
    }
  },
};

const deleteTopic = {
  type: TopicType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: TopicDocument, args: any) {
    try {
      let topic = await Topic.findByIdAndDelete(args.id);
      if (!topic) throw new GraphqlHTTPError("Topic ID not found.", 400);
      return topic;
    } catch (err) {
      throw new GraphqlHTTPError(err.message, 400);
    }
  },
};

export const TopicMutations = { addTopic, updateTopic, deleteTopic };
