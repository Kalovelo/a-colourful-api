import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import Keyword, { KeywordDocument } from "../models/Keyword";

export interface Keyword {
  id: string;
  name: string;
  svg: string;
}

export const KeywordType = new GraphQLObjectType({
  name: "Keyword",
  fields: () => ({
    id: { type: GraphQLID! },
    name: { type: GraphQLString! },
    svg: { type: GraphQLString! },
  }),
});

const addKeyword = {
  type: KeywordType,
  args: {
    name: { type: GraphQLString! },
    svg: { type: GraphQLString! },
  },
  async resolve(parent: Keyword, args: any) {
    const keyword = new Keyword({
      name: args.name,
      svg: args.svg,
    });
    return await keyword.save();
  },
};

const updateKeyword = {
  type: KeywordType,
  args: {
    name: { type: GraphQLString },
    svg: { type: GraphQLString },
  },
  async resolve(parent: Keyword, args: any) {
    let data: { name?: string | null; svg?: String } = {};
    if (args.name) data.name = args.name;
    if (args.svg) data.svg = args.svg;
    let keyword = await Keyword.findOneAndUpdate({ _id: args.id }, data as KeywordDocument, {
      new: true,
      runValidators: true,
    });
    if (!keyword) throw new Error("Keyword ID not found.");
  },
};

const deleteKeyword = {
  type: KeywordType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: Keyword, args: any) {
    let keyword = await Keyword.findByIdAndDelete(args.id);
    if (!keyword) throw new Error("Keyword ID not found.");
    return keyword;
  },
};

export const keywordMutations = { addKeyword, updateKeyword, deleteKeyword };
