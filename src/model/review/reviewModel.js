import ReviewSchema from "./reviewSchema.js";

// insert new review
export const insertReview = (obj) => {
  return ReviewSchema(obj).save();
};

// get all reviews
export const getReviews = (filter) => {
  return ReviewSchema.find({ filter });
};

// edit review by id
export const editReview = (_id, obj) => {
  return ReviewSchema.findOneAndReplace({ _id }, { obj }, { new: true });
};

//delete review
export const deleteReview = (_id) => {
  return ReviewSchema.findOneAndDelete({ _id });
};
