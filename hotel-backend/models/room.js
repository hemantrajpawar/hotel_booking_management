const mongoose = require("mongoose");

const room_schema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    type: {
      type: String,
      enum: ["Single", "Double", "Deluxe", "Premium Delux", "Suite"],
      required: true,
    },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    amenities: { type: [String] }, // ["AC", "WiFi", "TV"]
    isAvailable: { type: Boolean, default: true },
    image_url: { type: [String] },

    // NEW FIELDS
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", room_schema);
