const express = require("express");
const { authRouter } = require("./routes/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { userRouter } = require("./routes/users");
const fileupload = require("express-fileupload");
const { postsRouter } = require("./routes/posts");
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  cors({
    origin: true ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);

app.use(async (req, res, next) => {
  try {
    if (jwt.verify(req.cookies.token, process.env.JWT_SECRET)) {
      next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      error: error.message || "unauthorized access.",
    });
  }
});
app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);

module.exports = { app };
