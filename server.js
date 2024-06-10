import { auth } from "./src/middlewares/auth.js";
import bookRouter from "./src/router/bookRouter.js";
import burrowRouter from "./src/router/burrowRouter.js";
import { connectMongo } from "./src/config/mongoConfig.js";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import privateRouter from "./src/router/privateRouter.js";
import userRouter from "./src/router/userRouter.js";
import reviewRouter from "./src/router/reviewRouter.js";

const app = express();

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/library/users", userRouter);
app.use("/library/users/private", privateRouter);
app.use("/library/books", bookRouter);
app.use("/library/burrows", auth, burrowRouter);
app.use("/library/books/review", auth, reviewRouter);

//server route
app.use("/", (req, res, next) => {
  res.json({
    message: "Server running healthy",
  });
});

//route not found 404
app.use((req, res, next) => {
  const error = new Error("404 not found");
  error.status = 404;
  next(error);
});

//global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: "error",
    message: error.message,
  });
});

//Connect mongo
connectMongo();

//initialise server
const PORT = 8000;
app.listen(PORT, (error) =>
  error ? console.log(error) : console.log("Server Started")
);
