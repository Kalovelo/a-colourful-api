import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import GraphqlHTTPError from "../../../utils/GraphqlHTTPError";
import { KeywordDocument } from "../model/Keyword";
import {
  addKeyword as addKeywordService,
  deleteKeyword as deleteKeywordService,
  updateKeyword as updateKeywordService,
} from "../service/service";

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
  async resolve(_: KeywordDocument, args: KeywordDocument, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    return addKeywordService(args);
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
    return updateKeywordService(args);
  },
};

const deleteKeyword = {
  type: KeywordType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(_: KeywordDocument, args: any, { req }: any) {
    if (!req.isAdmin) throw new GraphqlHTTPError("Unauthorized.", 401);
    return deleteKeywordService(args.id);
  },
};

export const keywordMutations = { addKeyword, updateKeyword, deleteKeyword };
