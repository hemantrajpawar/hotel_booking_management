const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wish_Controller");

router.post("/:roomId", auth, addToWishlist);
router.delete("/:roomId", auth, removeFromWishlist);
router.get("/", auth, getWishlist);

module.exports = router;
