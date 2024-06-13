import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
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
      required: true,
    },
    status: {
      type: String,
      default: "inactive",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    expectedAvailable: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Books", bookSchema);
