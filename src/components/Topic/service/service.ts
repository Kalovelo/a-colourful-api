import GraphqlHTTPError from "../../../utils/GraphqlHTTPError";
import { validateDBID } from "../../../utils/validate";
import Keyword from "../../Keyword/model/Keyword";
import Topic, { TopicDocument } from "../model/Topic";

export const addTopic = async (topic: TopicDocument) => {
  const keywords = await Keyword.find()
    .where("_id")
    .in(topic.keywords)
    .catch(() => {
      return null;
    });
  if (!keywords) throw new GraphqlHTTPError("No keyword was found.", 404);

  return await Topic.create({
    name: topic.name,
    description: topic.description,
    keywords: keywords,
  });
};

export const updateTopic = async (args: any) => {
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
};

export const deleteTopic = async (id: string) => {
  if (!validateDBID(id)) throw new GraphqlHTTPError("Invalid ID", 400);
  const topic = await Topic.findByIdAndDelete(id);
  if (!topic) throw new GraphqlHTTPError("Event with specific ID not found", 404);
  return topic;
};
