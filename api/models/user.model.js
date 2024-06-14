const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema:
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 8,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a model:
const User = mongoose.model("User", userSchema);

// Export the model:
module.exports = User;
