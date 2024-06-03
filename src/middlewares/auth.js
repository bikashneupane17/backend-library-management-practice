import { verifyAccessJWT, verifyRefreshJWT } from "../utils/jwt.js";

import { findAccessJWTInDb } from "../model/session/SessionModel.js";
import { getUserByEmail } from "../model/user/UserModel.js";

// authenticate access jwt and send userInfo
export const auth = async (req, res, next) => {
  try {
    //1. destructure authorization (contains accessJWT) from reqheader
    const { authorization } = req.headers;

    //2. verify if the accessJWT is valid by decoding, not expired, using secrete key
    const decoded = verifyAccessJWT(authorization);

    //3. if verified, fing the token in DB, using the accessJWT from authorization
    if (decoded?.email) {
      const tokenObj = await findAccessJWTInDb(authorization);

      // 4. if token is present in the session table in DB, use the token to get user
      if (tokenObj?._id) {
        const user = await getUserByEmail(decoded.email);

        //5. if user is present send it as req.userInfo and go to next
        if (user?._id) {
          user.password = undefined;

          req.userInfo = user;

          return next();
        }
      }
    }

    // if  error, send not authorised error 403
    const error = {
      status: 403,
      message: decoded,
    };

    next(error);
  } catch (error) {
    next(error);
  }
};

// authenticate refresh jwt and send userInfo
export const jwtAuth = async (req, res, next) => {
  try {
    // 1. get refreshToken from req.header
    const { authorization } = req.headers;

    // 2. verify the refresh token
    const decoded = verifyRefreshJWT(authorization);

    // 3. check of token is present in db
    if (decoded?.email) {
      //4. using email from decode find user
      const user = await getUserByEmail(decoded.email);

      // if user is present and the token matches, send new accessToken
      if (user?._id && user.refreshJWT === authorization) {
        user.password = undefined;

        req.userInfo = user;

        return next();
      }
    }

    console.log("pointer here");
    console.log(decoded);
    // if  error, send not authorised error 403
    const error = {
      statue: 403,
      message: decoded,
    };
    next(error);
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  console.log(req.userInfo.role);
  req.userInfo.role === "admin"
    ? next()
    : next({
        status: 403,
        message: "Unauthorized, Access Denied",
      });
};
