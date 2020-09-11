import { GraphQLString, GraphQLNonNull } from "graphql";
import { UserType } from "./User";
import User, { UserDocument } from "../../models/User";
import * as bcrypt from "bcryptjs";
import GraphqlHTTPError from "../../utils/GraphqlHTTPError";

const register = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString)! },
    email: { type: new GraphQLNonNull(GraphQLString)! },
    password: { type: new GraphQLNonNull(GraphQLString)! },
    adminPass: { type: GraphQLString },
  },
  async resolve(_: UserDocument, args: any) {
    const user = await User.findOne({ username: args.username });
    if (!user) {
      if (args.password.length < 8) {
        throw new GraphqlHTTPError("Password should have at least 8 letters.", 400);
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);
      let role = "member";

      // should be admin
      if (args.adminPass)
        if (args.adminPass === process.env.ADMIN_PASS) {
          role = "admin";
        } else throw new GraphqlHTTPError("Invalid adminPass", 400);

      await User.create({
        username: args.username,
        email: args.email,
        password: hashedPassword,
        role,
        createdAt: Date.now(),
      });
      return true;
    } else throw new GraphqlHTTPError("Username already exists.", 403);
  },
};

const login = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString)! },
    password: { type: new GraphQLNonNull(GraphQLString)! },
  },
  async resolve(_: UserDocument, args: any, res: Response) {
    const user = await User.findOne({ username: args.username });
  },
};

export const UserMutations = { register, login };
