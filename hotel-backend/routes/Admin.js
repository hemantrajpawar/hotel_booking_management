const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getAllUsers,getAdminStats, deleteUser } = require("../controllers/adminController");

//  Admin-only routes
router.get("/users", auth, admin, getAllUsers);
router.delete("/users/:id", auth, admin, deleteUser);
router.get("/stats", admin, getAdminStats);


module.exports = router;
