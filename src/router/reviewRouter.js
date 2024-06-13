import express from "express";
import { auth, isAdmin } from "../middlewares/auth.js";
import {
  editReview,
  getReviews,
  insertReview,
} from "../model/review/reviewModel.js";
import { newReviewValidation } from "../middlewares/joiValidation.js";

const router = express.Router();

// get all review
router.get("/all", auth, isAdmin, async (req, res, next) => {
  try {
    const reviews = await getReviews();
    reviews &&
      res.json({
        status: "success",
        message: "",
        reviews,
      });
  } catch (error) {
    next(error);
  }
});

// get review (only active books)
router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews({ status: "active" });
    reviews &&
      res.json({
        status: "success",
        message: "",
        reviews,
      });
  } catch (error) {
    next(error);
  }
});

// insert new review
router.post("/", auth, newReviewValidation, async (req, res, next) => {
  try {
    const review = await insertReview(req.body);
    review?._id &&
      res.json({
        status: "success",
        message: "Review Added",
      });
  } catch (error) {
    next(error);
  }
});

// edit review (put)==> change status
router.patch("/", auth, isAdmin, async (req, res, next) => {
  try {
    const { _id, status } = req.body;
    const review = await editReview(_id, { status });

    review?._id
      ? res.json({
          status: "success",
          message: "Edit Success",
          review,
        })
      : res.json({
          status: "error",
          message: "Somethingg went wrong, try again",
        });
  } catch (error) {
    next(error);
  }
});

//delete review
export default router;
