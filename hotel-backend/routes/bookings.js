// routes/bookings.js
const express = require("express");
const router = express.Router();
const {
  bookRoom,
  cancelBooking,
  getUserBookings,
  createBooking,
  syncOfflineBookings
} = require("../controllers/bookingController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Booking = require("../models/booking");

// Customer routes
router.post("/", auth, bookRoom); // Book a room
router.get("/my_booking", auth, getUserBookings); // View user's bookings
router.post("/book", auth, createBooking); // Create new booking (on-hold)
router.post("/sync-bookings", auth, syncOfflineBookings); // Sync offline bookings
router.delete("/cancel/:id", auth, cancelBooking); // Cancel booking

// Admin route to get all bookings
router.get("/admin/bookings", auth, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "firstname lastname email")
      .populate("roomId", "type room_no title");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Mark booking as completed
router.put("/:id/completed", auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("roomId");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ msg: "Booking is already completed" });
    }

    booking.status = "completed";

    if (booking.roomId) {
      booking.roomId.isAvailable = true;
      await booking.roomId.save();
    }

    await booking.save();
    res.json({ msg: "Booking marked as completed", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
