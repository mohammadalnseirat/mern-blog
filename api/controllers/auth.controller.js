const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { handleErrors } = require("../utils/error");

// post request for signup:
const signup_post = async (req, res, next) => {
  //   console.log(req.body);
  const { username, email, password } = req.body;
  //   condition to check all inputs:
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    // return res.status(400).json({ message: "All fields are required!" });
    next(
      handleErrors(400, "All fields are required! Please fill all the fields!")
    );
  }

  // hash password:
  const hashedPassword = bcrypt.hashSync(password, 15);

  // create new user:
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // save to database
    await newUser.save();
    res.json("signup successfull");
  } catch (error) {
    // res.status(500).json({message:error.message});
    next(error);
  }
};

module.exports = { signup_post };
