import { deleteFile, uploadFile } from "../../../middleware/fileManager";
import GraphqlHTTPError from "../../../utils/GraphqlHTTPError";
import { validateDBID } from "../../../utils/validate";
import Keyword, { KeywordDocument } from "../model/Keyword";

export const addKeyword = async (keyword: KeywordDocument) => {
  keyword.svg = await uploadFile(keyword.svg);
  return await Keyword.create(keyword);
};

export const updateKeyword = async (args: any) => {
  if (!validateDBID) throw new GraphqlHTTPError("Invalid ID", 400);
  if (args.svg) args.svg = await uploadFile(args.svg);
  const keyword = await Keyword.findOneAndUpdate({ _id: args.id }, args, {
    new: true,
    runValidators: true,
  });
  if (!keyword) {
    deleteFile(args.svg);
    throw new GraphqlHTTPError("Keyword with this id was not found", 404);
  }
  return keyword;
};

export const deleteKeyword = async (id: string) => {
  if (!validateDBID(id)) throw new GraphqlHTTPError("Invalid ID", 400);
  const keyword = await Keyword.findByIdAndDelete(id);
  if (!keyword) throw new GraphqlHTTPError("Event with specific ID not found", 404);
  deleteFile(keyword.svg);
  return keyword;
};
