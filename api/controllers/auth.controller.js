const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { handleErrors } = require("../utils/error");
const jwt = require("jsonwebtoken");

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

// request for signin:
const signin_post = async (req, res, next) => {
  // get email&password from request body:
  const { email, password, _id } = req.body;

  // check if email and password provided:
  if (!email || !password || email === "" || password === "") {
    return next(
      handleErrors(400, "All fields are required! Please fill all fields!")
    );
  }

  try {
    // find valid user:
    // const validUser = await User.findOne({ id:_id });
    const validUser = await User.findOne({ email });

    // console.log(validUser)

    // const isEmailCorrect = validUser.email === email
    // check valid user:
    if (!validUser) {
      return next(handleErrors(404, "User not found,Try to sign up!"));
    }
    // compare password and check if password is correct:
    const isPasswordCorrect = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordCorrect) {
      return next(
        handleErrors(400, "Incorrect password,please enter a valid password")
      );
    }
    //  create a token:
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);

    // hide password:
    const { password: pass, ...rest } = validUser._doc;
    // Add token to cokkies:
    res
      .status(200)
      .cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = { signup_post, signin_post };
