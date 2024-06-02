import BookSchema from "./BookSchema.js";

//insert new book
export const addNewBookToDB = (bookObj) => {
  return BookSchema(bookObj).save();
};

// read all books
export const getAllBooksFromDB = (filter) => {
  return BookSchema.find(filter);
};

//get book by id
export const getBookById = (_id) => {
  console.log(_id);
  return BookSchema.findById(_id);
};

//edit book
export const editBookInDB = (_id, updateObj) => {
  return BookSchema.findByIdAndUpdate(_id, updateObj);
};

//delete books by id(s)
export const deleteBookByIds = (_id) => {
  return BookSchema.findOneAndDelete(_id);
};

// //delete book
// export const deleteBookInDB = (ids) => {
//   return BookSchema.deleteMany({ _id: { $in: ids } });
// };
