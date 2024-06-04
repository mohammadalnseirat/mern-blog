const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/sign-up", authController.signup_post);

module.exports = router;
