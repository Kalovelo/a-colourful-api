import { GraphQLObjectType, GraphQLString } from "graphql";

export const KeywordType = new GraphQLObjectType({
  name: "Keyword",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});
