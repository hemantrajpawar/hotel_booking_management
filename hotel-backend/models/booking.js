const mongoose = require("mongoose");

const booking_schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled","On-hold", "completed"],
      default: "booked",
    },

    holdExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports=mongoose.model("Booking_info",booking_schema);