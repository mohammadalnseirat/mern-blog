const User = require("../models/user.model");
const { handleErrors } = require("../utils/error");
const bcrypt = require("bcrypt");

const test = (req, res) => {
  res.json({ message: "api is working!" });
};

// put request for update api:
const update_put = async (req, res, next) => {
  // check userID:
  if (req.user.id !== req.params.userId) {
    return next(handleErrors(403, "You are not allowed to update this user."));
  }

  // password:
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(handleErrors(400, "Password must be at least 8 characters."));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 15);
  }
  // username:
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        handleErrors(400, "Username must be between 7 and 20 characters.")
      );
    }

    if (req.body.username.includes(" ")) {
      return next(handleErrors(400, "Username cannot contain spaces."));
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(handleErrors(400, "Username must be lowercase."));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        handleErrors(400, "Username can only contain letters and numbers.")
      );
    }
  }
  // update user:
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// delete account from database:
const deleteAccount_delete = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(handleErrors(403, "You are not allowed to delete this user."));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  test,
  update_put,
  deleteAccount_delete,
};
