const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createReview,
  getRoomReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { getAllReviews } = require("../controllers/reviewController");

// GET /api/reviews - get all reviews
router.get("/", getAllReviews);

// POST /api/reviews        -> Create review
router.post("/", auth, createReview);

// GET /api/reviews/:roomId -> Get all reviews of a room
router.get("/:roomId", getRoomReviews);

// PUT /api/reviews/:id     -> Update own review
router.put("/:id", auth, updateReview);

// DELETE /api/reviews/:id  -> Delete own review
router.delete("/:id", auth, deleteReview);

// In reviewRoutes.js
router.get("/check/:roomId", auth, async (req, res) => {
  const Booking = require("../models/booking");
  const booked = await Booking.findOne({
    userId: req.user.id,
    roomId: req.params.roomId,
    status: "completed", // or whatever status you want
  });
  res.json({ canReview: !!booked });
});


module.exports = router;
