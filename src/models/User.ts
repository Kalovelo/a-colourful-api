import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["Admin", "Member"] },
  createdAt: { type: Date, required: true },
});

const User = mongoose.model<UserDocument>("User", UserSchema);
export default User;
