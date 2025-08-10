const User = require("../models/user");
const Room = require("../models/room");

//  Add a room to wishlist
exports.addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.roomId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Prevent duplicates
    if (user.wishlist.includes(roomId)) {
      return res.status(400).json({ msg: "Room already in wishlist" });
    }

    user.wishlist.push(roomId);
    await user.save();

    res.json({ msg: "Room added to wishlist" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//  Remove a room from wishlist
exports.removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.roomId;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: roomId },
    });

    res.json({ msg: "Room removed from wishlist" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//  Get user's wishlist
exports.getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
