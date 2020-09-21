import connectDB from "./loaders/db";
const app = require("./app");

const PORT = process.env.PORT;
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
