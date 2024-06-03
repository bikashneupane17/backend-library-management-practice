import BurrowSchema from "./BurrowSchema.js";

//insert new Burrow
export const addNewBurrowToDB = (BurrowObj) => {
  return BurrowSchema(BurrowObj).save();
};

// read all Burrows
export const getAllBurrowsFromDB = (filter) => {
  return BurrowSchema.find(filter);
};

//get Burrow by id
export const getBurrowById = (_id) => {
  console.log(_id);
  return BurrowSchema.findById(_id);
};

//edit Burrow
export const editBurrowInDB = (_id, updateObj) => {
  return BurrowSchema.findByIdAndUpdate(_id, updateObj);
};

//delete Burrows by id(s)
export const deleteBurrowById = (_id) => {
  return BurrowSchema.findByIdAndDelete({ _id });
};

// //delete Burrow
// export const deleteBurrowInDB = (ids) => {
//   return BurrowSchema.deleteMany({ _id: { $in: ids } });
// };
