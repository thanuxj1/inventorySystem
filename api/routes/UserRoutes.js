const express = require("express");
const router = express.Router();

// Import model
const User = require('../Model/UserModel');

// Import user controller
const UserController = require("../controllers/UserControllers");

// Define routes
router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

// Export router
module.exports = router;
