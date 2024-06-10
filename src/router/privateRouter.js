import { auth, jwtAuth } from "../middlewares/auth.js";

import express from "express";
import { signAccessJWT } from "../utils/jwt.js";

const privateRouter = express.Router();
//============================ private controller ============================
//private login
//when user have accesToken as a header and server returns a user after authenticating
privateRouter.get("/", auth, (req, res, next) => {
  try {
    req.userInfo.refreshJWT = undefined;
    req.userInfo.__v = undefined;

    res.json({
      status: "success",
      message: "User Authenticated",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

//return new access Token when user token is expired and requests new one
privateRouter.get("/new-access", jwtAuth, (req, res, next) => {
  try {
    const { email } = req.userInfo;
    const accessJWT = signAccessJWT({ email });

    res.json({ accessJWT });
  } catch (error) {
    next(error);
  }
});

export default privateRouter;
