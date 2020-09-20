import { GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLObjectType } from "graphql";

const StageType = new GraphQLObjectType({
  name: "Stage",
  fields: () => ({
    name: { type: GraphQLString! },
    description: { type: GraphQLString! },
  }),
});

const CommandType = new GraphQLObjectType({
  name: "Command",
  fields: () => ({
    name: { type: GraphQLString! },
    description: { type: GraphQLString! },
  }),
});

const CheatSheetCommandBlockType = new GraphQLObjectType({
  name: "CheatSheetCommandBlock",
  fields: () => ({
    name: { type: GraphQLString! },
    commands: {
      type: new GraphQLList(CommandType)!,
    },
  }),
});

export const CheatSheetSchema = new GraphQLObjectType({
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

const StageInput = new GraphQLInputObjectType({
  name: "StageInput",
  fields: () => ({
    name: { type: GraphQLString! },
    description: { type: GraphQLString! },
  }),
});

const CommandInput = new GraphQLInputObjectType({
  name: "CommandInput",
  fields: () => ({
    name: { type: GraphQLString! },
    description: { type: GraphQLString! },
  }),
});

const CheatSheetCommandBlockInput = new GraphQLInputObjectType({
  name: "CheatSheetCommandBlockInput",
  fields: () => ({
    name: { type: GraphQLString! },
    commands: {
      type: new GraphQLList(CommandInput)!,
    },
  }),
});

export const CheatSheetInput = new GraphQLInputObjectType({
  name: "CheatSheetInput",
  fields: () => ({
    id: { type: GraphQLString },
    commandBlocks: {
      type: new GraphQLList(CheatSheetCommandBlockInput),
    },
    stages: {
      type: new GraphQLList(StageInput),
    },
  }),
});
