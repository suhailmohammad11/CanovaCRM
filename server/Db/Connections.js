const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection Established");
  } catch (err) {
    console.error("MongoDB Connection Failed", err);
    process.exit(1);
  }
};
connectDB();
