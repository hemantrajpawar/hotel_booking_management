const express = require('express');
const auth = require('../middleware/auth');
const Room = require("../models/room");
const admin = require('../middleware/admin');
const Booking=require('../models/booking')
const { getRooms, getRoomById, createRoom } = require('../controllers/room_controller');
const router = express.Router();

router.get('/', getRooms);

router.get('/available',auth,async(req,res)=>{    
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut || !guests) {
      return res.status(400).json({ msg: "Missing query parameters" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const guestCount = parseInt(guests);

    // Step 1: Get all rooms with enough capacity
    const candidateRooms = await Room.find({
      capacity: { $gte: guestCount }
    });

    // Step 2: Get all bookings that overlap with the requested date
    const bookedRoomIds = await Booking.find({
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    }).distinct("room"); // Get only the room IDs

    // Step 3: Filter out booked rooms
    const availableRooms = candidateRooms.filter(
      (room) => !bookedRoomIds.includes(room._id.toString())
    );

    res.json(availableRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
})


router.get('/:roomId',auth, getRoomById);


router.post('/admin', auth, admin, createRoom);


router.put('/admin/:id', auth, admin, async (req, res) => {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  }
);

  
router.delete('/admin/:id', auth, admin, async (req, res) => {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ msg: "Room deleted" });
  });

module.exports = router;
