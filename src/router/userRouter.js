import { addNewUserToDB, findUserByEmail } from "../model/user/UserModel.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
  loginUserValidate,
  newUserValidate,
} from "../middlewares/joiValidation.js";
import { signAccessJWT, signRefreshJWT } from "../utils/jwt.js";

import express from "express";

const userRouter = express.Router();

//============================ public controller ============================
//signup
userRouter.post("/signup", newUserValidate, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);

    const user = await addNewUserToDB(req.body);

    user?._id
      ? res.json({
          status: "success",
          message: "New User Registerd...",
        })
      : res.json({
          status: "error",
          message: "Could not Register User, try again...",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection:")) {
      error.message = "Email Already In Used...";
      error.status = 200;
    }
    next(error);
  }
});

//login
userRouter.post("/login", loginUserValidate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (user?._id) {
      const isPassword = comparePassword(password, user.password);

      if (isPassword) {
        user.password = undefined;

        return res.json({
          status: "success",
          message: "User Login Success",
          tokens: {
            accessJWT: signAccessJWT({ email }),
            refreshJWT: signRefreshJWT({ email }),
          },
        });
      }

      res.json({
        status: "error",
        message: "Incorrect Login Credential...",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
