const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://wpexplaind.com/wp-content/uploads/2020/12/How-to-start-a-blog.jpg",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
  },
  { timestamps: true }
);

// create a model:
const Post = mongoose.model("Post", postSchema);

// export the model:

module.exports = Post;
