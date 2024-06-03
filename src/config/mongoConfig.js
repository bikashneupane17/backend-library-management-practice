import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    conn && console.log("DB Connected");
  } catch (error) {
    console.log(error.message);
  }
};
