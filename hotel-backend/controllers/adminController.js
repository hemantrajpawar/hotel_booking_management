const User = require("../models/user");
const Booking = require("../models/booking");
const Room = require("../models/room");

exports.getAdminStats = async (req, res) => { 
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }, 
    ]);

    const confirmed = await Booking.countDocuments({ status: "confirmed" });
    const completed = await Booking.countDocuments({ status: "completed" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });

    // Occupancy Rate = total completed nights / total rooms * 30
    const rooms = await Room.countDocuments();
    const occupiedNights = await Booking.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $project: {
          nights: {
            $divide: [
              { $subtract: ["$checkOutDate", "$checkInDate"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: { _id: null, totalNights: { $sum: "$nights" } },
      },
    ]);
    const occupancyRate = rooms
      ? Math.round((occupiedNights[0]?.totalNights / (rooms * 30)) * 100)
      : 0;

    // 📊 Monthly Bookings (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const bookingsByMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthLabels = [];
    const bookingCounts = [];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleString("default", { month: "short" });
      monthLabels.push(month);

      const monthNumber = date.getMonth() + 1;
      const found = bookingsByMonth.find((m) => m._id === monthNumber);
      bookingCounts.push(found ? found.count : 0);
    }

    res.json({
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      occupancyRate,
      months: monthLabels,
      bookingsMonthly: bookingCounts,
      bookingStatus: { confirmed, completed, cancelled },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


// View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -wishlist"); // hide passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
