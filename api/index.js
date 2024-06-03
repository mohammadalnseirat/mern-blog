require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/user.route");
const port = process.env.PORT || 3000;

app.use(express.json());

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
app.get('/',(req,res)=>{
  res.send('hello world')
})
// use the user router:
app.use("/api/user", userRouter);
