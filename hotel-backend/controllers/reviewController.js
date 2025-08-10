const Review = require("../models/review");
const Room = require("../models/room");

//  Create a review
exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const { roomId, rating, comment } = req.body;

  try {
    // Prevent duplicate review
    const existing = await Review.findOne({ userId: userId, roomId: roomId });
    if (existing) {
      return res.status(400).json({ msg: "You already reviewed this room." });
    }

    const review = await Review.create({
      userId: userId,
      roomId: roomId,
      rating,
      comment
    });

    await Review.calculateAverageRating(roomId);

    res.status(201).json({ msg: "Review posted successfully", review });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//  Get all reviews for a room
//  Get all reviews for a room
exports.getRoomReviews = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const reviews = await Review.find({ roomId: roomId })
      .populate("userId", "firstname lastname") // Show reviewer name
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


//  Update own review
exports.updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(403).json({ msg: "You can update only your review." });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    await Review.calculateAverageRating(req.body.roomId);


    res.json({ msg: "Review updated", review });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
    .populate("userId", "firstname lastname email profilePhoto")     
    .populate("roomId", "type price");  
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server Error: Could not fetch reviews" });
  }
};


//  Delete own review
exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  try {
    const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(403).json({ msg: "You can delete only your review." });
    }

    await Review.calculateAverageRating(req.body.roomId);

    res.json({ msg: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
