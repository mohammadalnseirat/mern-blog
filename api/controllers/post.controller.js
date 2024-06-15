const { handleErrors } = require("../utils/error");
const Post = require("../models/post.model");

const createPost_post = async (req, res, next) => {
  // check if the user is admin:
  if (!req.user.isAdmin) {
    return next(handleErrors(403, "You are not Allowed to create a post."));
  }

  //   check title and content of the post :
  if (!req.body.title || !req.body.content) {
    return next(handleErrors(400, "Please Provide all required fields."));
  }
  // create a slug for the post :
  const sulg = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  // create a new post :
  const newPost = new Post({ ...req.body, sulg, userId: req.user.id });
  try {
    // sved the new post:
    const savedPost = newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost_post };
