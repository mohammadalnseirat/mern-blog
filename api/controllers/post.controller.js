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

// get post :
const get_posts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    // find all posts and dependencies on :
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      // for searchTerm:
      ...(req.queryry.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // get totaltPosts:
    const totalPosts = await Post.countDocuments();

    // get total post for last month:
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    // create response and send data to frontend:
    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

// delte post :
const deletePost_delete = async (req, res, next) => {
  // check if the user is admin or not:
  if (req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(handleErrors(403, "You are not allowed to delete this post."));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    // create respones:
    res.status(200).json("The Post has been deleted Successfully.");
  } catch (error) {
    next(error);
  }
};
// update post:
const updatePost_Put = async (req, res, next) => {
  // check if the user is admin or not:
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(handleErrors(403, "You are not allowed to update this post."));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    // create a response:
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost_post,
  get_posts,
  deletePost_delete,
  updatePost_Put,
};
