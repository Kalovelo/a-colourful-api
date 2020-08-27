import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";

const StageType = new GraphQLObjectType({
  name: "Stage",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const CommandType = new GraphQLObjectType({
  name: "Command",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const CheatSheetCommandBlockType = new GraphQLObjectType({
  name: "CheatSheet CommandBlock",
  fields: () => ({
    name: { type: GraphQLString },
    commands: {
      type: new GraphQLList(CommandType),
    },
  }),
});

export const CheatSheetType = new GraphQLObjectType({
  name: "CheatSheet",
  fields: () => ({
    id: { type: GraphQLString },
    commandBlocks: {
      type: new GraphQLList(CheatSheetCommandBlockType),
    },
    stages: {
      type: new GraphQLList(StageType),
    },
  }),
});
