import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import Keyword, { KeywordDocument } from "../models/Keyword";
import { uploadFileGraphQL, deleteFile, uploadFile } from "../middleware/fileManager";

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
  async resolve(parent: KeywordDocument, args: any) {
    const { filename, mimetype, encoding, createReadStream } = await args.svg;
    const stream = createReadStream();
    const path: string = (await uploadFileGraphQL(stream, filename, mimetype)) as string;
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
  async resolve(parent: KeywordDocument, args: any) {
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
  async resolve(parent: KeywordDocument, args: any) {
    let keyword = await Keyword.findByIdAndDelete(args.id);
    if (!keyword) throw new Error("Keyword ID not found.");
    return keyword;
  },
};

export const keywordMutations = { addKeyword, updateKeyword, deleteKeyword };
