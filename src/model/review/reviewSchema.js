import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    bookId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    bookTitle: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    burrowId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reviews", reviewSchema);
