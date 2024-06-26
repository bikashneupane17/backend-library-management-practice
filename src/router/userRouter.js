import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
  createNewUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
} from "../model/user/UserModel.js";
import {
  loginUserValidate,
  newUserValidate,
} from "../middlewares/joiValidation.js";
import { signAccessJWT, signRefreshJWT } from "../utils/jwt.js";
import express from "express";
import { auth, isAdmin, jwtAuth } from "../middlewares/auth.js";

const router = express.Router();

//============================ public controller ============================
//signup
router.post("/signup", newUserValidate, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);

    const user = await createNewUser(req.body);

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
router.post("/login", loginUserValidate, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

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
    }

    res.json({
      status: "error",
      message: "Incorrect Login Credential...",
    });
  } catch (error) {
    next(error);
  }
});

//============================ private controller ============================
//private login
//when user have accesToken as a header and server returns a user after authenticating
router.get("/", auth, (req, res, next) => {
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
router.get("/new-access", jwtAuth, (req, res, next) => {
  try {
    const { email } = req.userInfo;
    const accessJWT = signAccessJWT({ email });

    res.json({ accessJWT });
  } catch (error) {
    next(error);
  }
});

// get all user => admin access only
router.get("/all", auth, isAdmin, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    users &&
      res.json({
        status: "success",
        message: "",
        users: users.map((item) => {
          (item.refreshJWT = undefined),
            (item.__v = undefined),
            (item.password = undefined);
          return item;
        }),
      });
  } catch (error) {
    next(error);
  }
});
export default router;

//update user
router.put("/", auth, isAdmin, async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;
    const user = await updateUser({ _id }, { ...rest });

    user?._id
      ? res.json({
          status: "success",
          message: "User updated...",
        })
      : res.json({
          status: "error",
          message: "Could not edit user, try again",
        });
  } catch (error) {
    next(error);
  }
});
