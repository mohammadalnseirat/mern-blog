require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;


app.use(express.json());

// connect to database:
mongoose.connect(process.env.MONGODB_URL).then(()=>{
  console.log('mongoDB is connected to database')
}).catch((err)=>{
  console.log(err)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
