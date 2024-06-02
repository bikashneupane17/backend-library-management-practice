import { addAccessTokenToDB } from "../model/session/SessionModel.js";
import jwt from "jsonwebtoken";
import { updateUserInDB } from "../model/user/UserModel.js";

//create access token
// payload has a string, and we are destructuring
export const signAccessJWT = ({ email }) => {
  const accessJWT = jwt.sign({ email }, process.env.ACCESS_JWT_PRIVATE_KEY, {
    expiresIn: "1m",
  });

  addAccessTokenToDB({ accessJWT });

  return accessJWT;
};

//verify access token
export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_JWT_PRIVATE_KEY);
  } catch (error) {
    return error.message === "jwt expired" ? "jwt expired" : "Invalid Token";
  }
};

// ===============================================================

//create refresh token
export const signRefreshJWT = ({ email }) => {
  const refreshJWT = jwt.sign({ email }, process.env.REFRESH_JWT_PRIVATE_KEY, {
    expiresIn: "10d",
  });

  updateUserInDB({ email }, { refreshJWT });
  return refreshJWT;
};

//verify refresh token
export const verifyRefreshJWT = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_JWT_PRIVATE_KEY);
  } catch (error) {
    return error;
  }
};
