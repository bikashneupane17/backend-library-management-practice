import mongoose from "mongoose";

const burrowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    bookId: {
      type: mongoose.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    userName: {
      type: String,
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
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Burrows", burrowSchema);
