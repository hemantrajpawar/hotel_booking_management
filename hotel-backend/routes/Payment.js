const express = require("express");
const Razorpay=require("razorpay");
require("dotenv").config({ path: path.resolve(__dirname, '../.env') }); // 👈 MUST be first
const crypto = require( "crypto"); // ✅ You forgot to import this

const auth = require("../middleware/auth");
const Payment=require("../models/payment");


const Booking = require("../models/booking");
const Room = require("../models/room");
const { generateInvoiceAndSend } = require("../utils/generate_invoice");



const router = express.Router();


//  Razorpay instance
const razorpayinstance = new Razorpay({
  key_id: process.env.Razorpay_KeyId,
  key_secret: process.env.Razorpay_Secret,
});

//  Booking Payment Route
router.post("/Booking_payment", auth, async (req, res) => {
  const { totalPrice } = req.body;

  if (!totalPrice) {
    return res.status(400).json({ msg: "Total price is required" });
  }

  try {
    const payload = {
      amount: Math.round(totalPrice * 100), 
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    // Use async/await for cleaner error handling
    const order = await razorpayinstance.orders.create(payload);
    res.status(200).json({ data: order });
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ msg: "Error generating Razorpay order" });
  }
});


router.post('/verify', auth, async (req, res) => {
  const {
    payment_orderId,
    transactionId,
    payment_signature,
    bookingDetails // include: roomId, checkIn, checkOut, guests, totalPrice
  } = req.body;

  try {
    const sign = `${payment_orderId}|${transactionId}`;

    const expectedSign = crypto.createHmac("sha256", process.env.Razorpay_Secret)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === payment_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ✅ Save Payment
    const payment = new Payment({
      bookingId: null,
      userId: req.user.id,
      amount: bookingDetails.totalPrice,
      status: "Success",
      payment_signature,
      transactionId,
      payment_orderId, // ✅ ADD THIS
      paymentMethod: "Razorpay",
    });
    

    // ✅ Create Booking
    const room = await Room.findById(bookingDetails.roomId);
    if (!room || !room.isAvailable) {
      return res.status(400).json({ msg: "Room not available" });
    }

    const newBooking = await Booking.create({
      userId: req.user.id,
      roomId: room._id,
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      guests: bookingDetails.guests,
      totalPrice: bookingDetails.totalPrice,
      status:"booked"
    });

    //  Link booking to payment
    payment.bookingId = newBooking._id;
    await payment.save();

    // ✅ Populate for invoice
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("userId")
      .populate("roomId");

    // ✅ Invoice data
    const invoiceData = {
      customerName: populatedBooking.userId.firstname + " " + populatedBooking.userId.lastname,
      roomType: populatedBooking.roomId.type,
      amount: populatedBooking.roomId.price,
      email: populatedBooking.userId.email,
    };

    // ✅ Send Invoice
    await generateInvoiceAndSend(invoiceData);

    // ✅ Mark Room Unavailable
    await Room.findByIdAndUpdate(room._id, { isAvailable: false });

    return res.status(200).json({
      message: "Payment verified, booking created, and invoice sent!",
      booking: newBooking,
    });

  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports =router;
