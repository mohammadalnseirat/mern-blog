const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.control");
const {verifyToken}=require('../utils/verifyToken')

// test api:
router.get("/test", userController.test);
router.put('/update/:userId',verifyToken,userController.update_put)
module.exports = router;
