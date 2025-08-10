import React, { useEffect, useState } from "react";
import axios from "axios";
import "./My_bookings.css";

function My_bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelled, setCancelled] = useState(null); // track which one is being cancelled

  const token = localStorage.getItem("token");

  const handleCancel = async (bookingId) => {
    try {
      setCancelled(bookingId);
      const res = await axios.delete(`/api/bookings/cancel/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      alert("Booking cancelled successfully!");
  
      // Optionally re-fetch or filter out the cancelled one
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error("Cancel failed", err);
      alert("Failed to cancel booking.");
    } finally {
      setCancelled(null);
    }
  };
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/api/bookings/my_booking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const categorizeBookings = (status) =>
    bookings.filter((booking) => booking.status === status);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="my-bookings-page">
      <h2>Your Bookings</h2>

      {/* Ongoing */}
      <h3>🟢 Ongoing</h3>
      {categorizeBookings("booked").length > 0 ? (
        categorizeBookings("booked").map((b) => (
          <div key={b._id} className="booking-card">
            <p>Room: {b.roomId?.type}</p>
            <p>Check-In: {formatDate(b.checkIn)}</p>
            <p>Check-Out: {formatDate(b.checkOut)}</p>
            <p>Total: ₹{b.totalPrice}</p>

            <button
              className="cancel-btn"
              onClick={() => handleCancel(b._id)}
              disabled={cancelled === b._id}
            >
              {cancelled === b._id ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        ))
      ) : (
        <p>No ongoing bookings</p>
      )}

      {/* Completed */}
      <h3>✅ Completed</h3>
      {categorizeBookings("completed").length > 0 ? (
        categorizeBookings("completed").map((b) => (
          <div key={b._id} className="booking-card">
            <p>Room: {b.roomId?.type}</p>
            <p>
              Stayed: {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
            </p>
            <p>Total: ₹{b.totalPrice}</p>
          </div>
        ))
      ) : (
        <p>No completed stays</p>
      )}

      {/* Cancelled */}
      <h3>🔴 Cancelled</h3>
      {categorizeBookings("cancelled").length > 0 ? (
        categorizeBookings("cancelled").map((b) => (
          <div key={b._id} className="booking-card cancelled">
            <p>Room: {b.roomId?.type}</p>
            <p>Cancelled Booking</p>
            <p>Total: ₹{b.totalPrice}</p>
          </div>
        ))
      ) : (
        <p>No cancelled bookings</p>
      )}
    </div>
  );
}

export default My_bookings;
