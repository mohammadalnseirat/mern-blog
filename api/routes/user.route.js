const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.control");

// test api:
router.get("/test", userController.test);
module.exports = router;
