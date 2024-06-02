import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publishedYear: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "inactive",
  },
});

export default mongoose.model("Books", bookSchema);
