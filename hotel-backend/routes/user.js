const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getUserById,
  updatePassword,
  getAllUsers,
  deleteUserById
} = require("../controllers/user_controller");

const  auth = require("../middleware/auth");
const  admin = require("../middleware/admin");

// Routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/password",auth, updatePassword);
router.get("/",auth,admin, getAllUsers);
router.delete("/:id",auth,admin, deleteUserById);
router.get("/:userId",auth, getUserById);

module.exports = router;
