import SessionSchema from "./SessionSchema.js";

//create new session token
export const addAccessTokenToDB = (accessJWT) => {
  return SessionSchema(accessJWT).save();
};

//find token in database
export const findAccessJWTInDb = (accessJWT) => {
  return SessionSchema.findOne({ accessJWT });
};
