const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Success", "Pending", "Failed"],
      required: true,
    },
    payment_orderId:{
      type:String,
      required:true
    },
    payment_signature: { type: String, required: true },
    paymentMethod: { type: String }, // Card, UPI, etc.
    date: {
      type: Date,
      default: Date.now,
    },
    transactionId: { type: String , required:true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
