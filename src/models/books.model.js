import mongoose, { Schema } from "mongoose";

const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", booksSchema)
