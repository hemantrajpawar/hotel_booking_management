const Booking = require("../models/booking");
const Room = require("../models/room");
const mongoose = require("mongoose");

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    // Monthly bookings grouped by year and month
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$checkInDate" },
            month: { $month: "$checkInDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Occupancy rate = (booked room nights / total room nights available) * 100
    const totalRooms = await Room.countDocuments();
    const totalDays = 30; // Change to your preferred window (e.g., current month)
    const totalRoomNightsAvailable = totalRooms * totalDays;

    const occupiedNights = await Booking.aggregate([
      {
        $project: {
          nights: {
            $dateDiff: {
              startDate: "$checkInDate",
              endDate: "$checkOutDate",
              unit: "day"
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalNights: { $sum: "$nights" }
        }
      }
    ]);

    const occupied = occupiedNights[0]?.totalNights || 0;
    const occupancyRate = (occupied / totalRoomNightsAvailable) * 100;

    res.status(200).json({
      monthlyBookings,
      occupancyRate,
    });
  } catch (err) {
    console.error("Error in analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};



module.exports = {
  getAnalytics
};
