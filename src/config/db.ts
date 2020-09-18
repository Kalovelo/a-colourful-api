import { errorHandler } from "../utils/errorHandler";

const mongoose = require("mongoose");

const connectDB: () => Promise<void> = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`🚀 Mongo Connected: ${conn.connection.host}`);
  } catch (err) {
    errorHandler.handleError(err);
    process.exit(1);
  }
};

export default connectDB;
