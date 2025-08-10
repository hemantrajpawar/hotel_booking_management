// controllers/bookingController.js
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Room = require("../models/room");
const nodemailer = require("nodemailer");
const { generateInvoiceAndSend } = require("../utils/generate_invoice");
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

// Setup mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility: Check room availability
const checkAvailability = async (roomId, checkIn, checkOut) => {
  const conflict = await Booking.findOne({
    roomId,
    status: { $in: ["booked", "On-hold"] },
    $and: [
      { checkIn: { $lt: checkOut } },
      { checkOut: { $gt: checkIn } },
    ],
  });
  return conflict === null;
};

// Create booking (for mobile/online hold)
const createBooking = async (req, res) => {
  const { userId, roomId, checkIn, checkOut, guests, totalPrice } = req.body;
  if (!userId || !roomId || !checkIn || !checkOut || !guests || !totalPrice) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Invalid dates." });
    }

    const isAvailable = await checkAvailability(roomId, checkInDate, checkOutDate);
    if (!isAvailable) {
      return res.status(409).json({ success: false, message: "Room not available." });
    }

    const booking = new Booking({
      userId,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      status: "On-hold",
      holdExpires: Date.now() + 45 * 60 * 1000,
    });

    await booking.save();

    if (req.io) {
      req.io.to(roomId).emit('room-status-update', {
        roomId,
        status: 'On-hold',
        holdExpires: booking.holdExpires
      });
    }

    res.status(201).json({ success: true, message: "Room held for 45 minutes.", booking });
  } catch (err) {
    console.error("Create Booking Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// Sync offline bookings
const getAlternativeRooms = async (roomType) => {
  return await Room.find({
    type: { $ne: roomType },
    isAvailable: true,
  }).limit(3);
};

const syncOfflineBookings = async (req, res) => {
  const offlineBookings = req.body;
  const results = [];

  for (const data of offlineBookings) {
    try {
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);
      const isAvailable = await checkAvailability(data.roomId, checkIn, checkOut);

      const userEmail = data.userEmail || data.email; // ensure you pass this from client
      const userName = data.userName || "Guest"; // optional personalization
      const room = await Room.findById(data.roomId);

      if (isAvailable) {
        const newBooking = new Booking({
          ...data,
          checkIn,
          checkOut,
          status: "On-hold",
          holdExpires: Date.now() + 45 * 60 * 1000,
        });
        await newBooking.save();

        if (req.io) {
          req.io.to(data.roomId).emit("room-status-update", {
            roomId: data.roomId,
            status: "On-hold",
            holdExpires: newBooking.holdExpires,
          });
        }

        results.push({ booking: data, success: true, message: "Held successfully." });

        // Send email: Room held
        if (userEmail) {
          await transporter.sendMail({
            from: '"Hotel Vyankatesh" <' + process.env.EMAIL_ID + '>',
            to: userEmail,
            subject: "Room Hold Confirmation",
            html: `
              <p>Dear ${userName},</p>
              <p>Your requested room <b>${room.type}</b> has been successfully put on hold from <b>${checkIn.toDateString()}</b> to <b>${checkOut.toDateString()}</b>.</p>
              <p>The hold will expire in 45 minutes. Please confirm the booking within that time.</p>
              <p>Thank you,<br>Hotel Vyankatesh</p>
            `,
          });
        }
      } else {
        results.push({ booking: data, success: false, message: "Room unavailable." });

        // Find alternative available rooms
        const alternatives = await getAlternativeRooms(room.type);
        const alternativeList = alternatives.length
          ? `<ul>${alternatives.map(room => `<li>${room.type} - ₹${room.price}</li>`).join('')}</ul>`
          : "<p>No alternatives available at this time.</p>";

        // Send email: Room unavailable
        if (userEmail) {
          await transporter.sendMail({
            from: '"Hotel Vyankatesh" <' + process.env.EMAIL_ID + '>',
            to: userEmail,
            subject: "Room Unavailable - Suggested Alternatives",
            html: `
              <p>Dear ${userName},</p>
              <p>We're sorry, but your requested room <b>${room.type}</b> is already booked for the selected dates.</p>
              <p>Here are some alternative available rooms:</p>
              ${alternativeList}
              <p>We hope one of these options works for you!</p>
              <p>Regards,<br>Velora palace</p>
            `,
          });
        }
      }
    } catch (err) {
      console.error("Sync Booking Error:", err);
      results.push({ booking: data, success: false, message: `Error: ${err.message}` });
    }
  }

  res.status(200).json({ success: true, results });
};

// Book a room immediately (confirmed booking + invoice)
const bookRoom = async (req, res) => {
  const { roomId, checkIn, checkOut, guests, totalPrice } = req.body;
  const userId = req.user.id;

  try {
    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) {
      return res.status(400).json({ msg: "Room not available" });
    }

    const booking = await Booking.create({
      userId, roomId, checkIn, checkOut, guests, totalPrice,
      status: "booked"
    });

    const populatedBooking = await Booking.findById(booking._id).populate("userId").populate("roomId");

    const invoiceData = {
      customerName: `${populatedBooking.userId.firstname} ${populatedBooking.userId.lastname}`,
      roomType: populatedBooking.roomId.type,
      amount: populatedBooking.totalPrice,
      email: populatedBooking.userId.email,
    };

    await generateInvoiceAndSend(invoiceData);
    await Room.findByIdAndUpdate(roomId, { isAvailable: false });

    res.status(201).json({ msg: "Room booked & invoice sent." });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ msg: "Server error." });
  }
};

// Get user's bookings and auto-complete if outdated
const getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.find({ userId }).populate("roomId");
    const today = new Date();

    const updated = await Promise.all(bookings.map(async (booking) => {
      if (booking.status === "booked" && new Date(booking.checkOut) < today) {
        booking.status = "completed";
        await booking.save();
      }
      return booking;
    }));

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch bookings." });
  }
};

// Cancel booking and send cancellation invoice
const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id).populate("userId").populate("roomId");

    if (!booking || booking.status === "cancelled") {
      return res.status(400).json({ msg: "Invalid booking or already cancelled." });
    }

    booking.status = "cancelled";
    await booking.save();

    await Room.findByIdAndUpdate(booking.roomId._id, { isAvailable: true });

    const invoiceData = {
      customerName: booking.userId.firstname,
      roomType: booking.roomId.type,
      amount: booking.totalPrice,
      email: booking.userId.email,
    };

    await generateInvoiceAndSend(invoiceData, "cancellation");

    res.json({ msg: "Cancelled and invoice sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Cancellation failed." });
  }
};

module.exports = {
  bookRoom,
  cancelBooking,
  getUserBookings,
  createBooking,
  syncOfflineBookings,
};
