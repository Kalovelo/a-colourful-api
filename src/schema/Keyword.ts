import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { uploadFile } from "../middleware/fileManager";
import Keyword, { KeywordDocument } from "../models/Keyword";
import GraphqlHTTPError from "../utils/GraphqlHTTPError";

const { GraphQLUpload } = require("graphql-upload");

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
    name: { type: new GraphQLNonNull(GraphQLString)! },
    svg: { type: new GraphQLNonNull(GraphQLUpload)! },
  },
  async resolve(_: KeywordDocument, args: any, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    const path: string = await uploadFile(args.svg);
    const keyword = await Keyword.create({
      name: args.name,
      svg: path,
    });
    return keyword;
  },
};

export const updateKeyword = {
  type: KeywordType,
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    svg: { type: GraphQLString },
  },
  async resolve(_: KeywordDocument, args: any, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    if (args.svg) args.svg = uploadFile(args.svg);
    let keyword = await Keyword.findOneAndUpdate({ _id: args.id }, args as KeywordDocument, {
      new: true,
      runValidators: true,
    });
    if (!keyword) throw new Error("Keyword ID not found.");
    return keyword;
  },
};

const deleteKeyword = {
  type: KeywordType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(_: KeywordDocument, args: any, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    let keyword = await Keyword.findByIdAndDelete(args.id);
    if (!keyword) throw new Error("Keyword ID not found.");
    return keyword;
  },
};

export const keywordMutations = { addKeyword, updateKeyword, deleteKeyword };
