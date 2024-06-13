import { auth, isAdmin } from "../middlewares/auth.js";
import {
  deleteABookById,
  getABookById,
  getAllBooks,
  insertBook,
  updateABookById,
} from "../model/book/BookModel.js";

import express from "express";
import { newBookValidate } from "../middlewares/joiValidation.js";
import { updateABurrowById } from "../model/burrow_history/BurrowModel.js";

const bookRouter = express.Router();

//add new book === private
bookRouter.post("/", auth, isAdmin, newBookValidate, async (req, res, next) => {
  try {
    const newBook = await insertBook(req.body);

    newBook?._id
      ? res.json({
          status: "success",
          message: "New Book Added...",
        })
      : res.json({
          status: "error",
          message: "Error Adding Book, try again...",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message = "Another book with same ISBN already registered...";
      error.status = 200;
    }
    next(error);
  }
});

// get all books === private
bookRouter.get("/all", async (req, res, next) => {
  try {
    const books = await getAllBooks();
    res.json({
      status: "success",
      books,
    });
  } catch (error) {
    next(error);
  }
});

// public controller - user access - sends only active books
bookRouter.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const books = _id
      ? await getABookById(_id)
      : await getAllBooks({ status: "active" });

    res.json({
      status: "success",
      books,
    });
  } catch (error) {
    next(error);
  }
});

//edit book -------admin access
bookRouter.put("/", auth, isAdmin, async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;
    const update = await updateABookById(_id, rest);

    update?._id
      ? res.json({
          status: "success",
          message: "The book has been updated",
        })
      : res.json({
          status: "error",
          message: "Unable to update the book, try again later",
        });
  } catch (error) {
    next(error);
  }
});

// delete book === admin access
bookRouter.delete("/:_id?", auth, isAdmin, async (req, res, next) => {
  try {
    const { _id } = req.params;

    const deletedBook = await deleteABookById(_id);

    deletedBook?._id
      ? res.json({
          status: "success",
          message: "Book Deleted",
        })
      : res.json({
          status: "error",
          message: "Delete Request failed, try again....",
        });
  } catch (error) {
    next(error);
  }
});

export default bookRouter;
