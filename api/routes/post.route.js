const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken");
const postController = require("../controllers/post.controller");

// post request to create a new post:
router.post("/create-post", verifyToken, postController.createPost_post);
router.get('/get-posts',postController.get_posts)

module.exports = router;
