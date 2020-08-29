import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

export const KeywordType = new GraphQLObjectType({
  name: "Keyword",
  fields: () => ({
    id: { type: GraphQLID! },
    name: { type: GraphQLString! },
    description: { type: GraphQLString! },
    svg: { type: GraphQLString! },
  }),
});
