import {
  addNewBookToDB,
  deleteBookById,
  editBookInDB,
  getAllBooksFromDB,
  getBookById,
} from "../model/book/BookModel.js";
import { auth, isAdmin } from "../middlewares/auth.js";

import express from "express";
import { newBookValidate } from "../middlewares/joiValidation.js";

const bookRouter = express.Router();

//add new book === private
bookRouter.post("/", auth, isAdmin, newBookValidate, async (req, res, next) => {
  try {
    const newBook = await addNewBookToDB(req.body);

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
    const books = await getAllBooksFromDB();
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
      ? await getBookById(_id)
      : await getAllBooksFromDB({ status: "active" });

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

    const editedBook = await editBookInDB(_id, rest);
    editedBook?._id
      ? res.json({
          status: "success",
          message: "Book Edited",
        })
      : res.json({
          status: "error",
          message: "Book Edit Fail",
        });
  } catch (error) {
    next(error);
  }
});

// delete book === admin access
bookRouter.delete("/:_id?", auth, isAdmin, async (req, res, next) => {
  try {
    const { _id } = req.params;

    const deletedBook = await deleteBookById(_id);
    console.log(_id, result);
    console.log("first");

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
