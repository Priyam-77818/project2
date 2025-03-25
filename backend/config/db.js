import mongoose from "mongoose";

const connectDb = async () => {
  try {
    console.log("ENV:", process.env.MONGODB_URI); // debug

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected");
  } catch (error) {
    console.log("db connection failed");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDb;