import UserSchema from "./UserSchema.js";

//add user
export const addNewUserToDB = (userObj) => {
  return UserSchema(userObj).save();
};

//find user by eamil
export const findUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};

//update user
export const updateUserInDB = async (filter, obj) => {
  return await UserSchema.findOneAndUpdate(filter, obj);
};
