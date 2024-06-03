import { auth, isAdmin } from "../middlewares/auth.js";
import {
  newBookValidate,
  newBurrowValidate,
} from "../middlewares/joiValidation.js";

import { editBookInDB } from "../model/book/BookModel.js";
import express from "express";

const maxBurrowingDays = 15;

const burrowRouter = express.Router();

//add new bowrrow === private
burrowRouter.post("/", newBurrowValidate, async (req, res, next) => {
  try {
    const { _id, firstName } = req.userInfo;

    const burrow = await addNewBurrowToDB({
      ...req.body,
      userId: _id,
      userName: firstName,
    });

    //if burrow successfully
    //then => update the book table,isAvailable:false
    if (burrow) {
      await editBookInDB(req.body.bookId, {
        isAvailable: false,
        expectedAvailable: today.setDate(
          today.getDate() + maxBurrowingDays,
          "days"
        ),
      });
    }

    burrow?._id
      ? res.json({
          status: "success",
          message: "This book is now available in your account",
        })
      : res.json({
          status: "error",
          message: "Unable to burrow the book, try again...",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message = "Another book with same ISBN already registered...";
      error.status = 200;
    }
    next(error);
  }
});

export default burrowRouter;
