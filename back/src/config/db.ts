import mongoose from "mongoose";
const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string, {});
    console.log("MongoDB connected.", connection.connection.host);
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
export default connectDb;
