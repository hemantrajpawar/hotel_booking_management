const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Static method to calculate average rating & total reviews
reviewSchema.statics.calculateAverageRating = async function (roomId) {
  const result = await this.aggregate([
    { $match: { roomId: new mongoose.Types.ObjectId(roomId) } },
    {
      $group: {
        _id: "$roomId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const update = result.length > 0
    ? {
        averageRating: Number(result[0].averageRating.toFixed(1)),
        totalReviews: result[0].totalReviews,
      }
    : {
        averageRating: 0,
        totalReviews: 0,
      };

  await mongoose.model("Room").findByIdAndUpdate(roomId, update);
};

// ✅ Trigger after saving a new review
reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.roomId);
});

// ✅ Trigger after deleting a review
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.roomId);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
