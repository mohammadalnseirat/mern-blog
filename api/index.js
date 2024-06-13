require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// connect to database:
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("mongoDB is connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("hello world");
});
// use the user router:
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Add middleware and a function to handle errors:
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
