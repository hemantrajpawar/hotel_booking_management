import React, { useEffect, useCallback, useState, useMemo } from "react";
import axios from "axios";
import "./Booking_management.css"; // Optional: style your table and pagination buttons

function Booking_management() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get("/api/bookings/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/bookings/${id}/completed`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBookings();
    } catch (err) {
      console.error("Error updating booking status", err);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel/delete this booking?"))
      return;
    try {
      await axios.delete(`/api/bookings/cancel/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("deletd room");
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking", err);
    }
  };

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  // Pagination logic
  const totalPages = useMemo(
    () => Math.ceil(filteredBookings.length / bookingsPerPage),
    [filteredBookings]
  );
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = useMemo(
    () => filteredBookings.slice(indexOfFirst, indexOfLast),
    [filteredBookings, indexOfFirst, indexOfLast]
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="admin-booking-management">
      <h2 className="dashboard-title"> Booking Management</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("booked")}>Booked</button>
        <button onClick={() => setFilter("On-hold")}>On-Hold</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("cancelled")}>Cancelled</button>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : currentBookings.length === 0 ? (
        <p>No bookings found for selected filter</p>
      ) : (
        <>
          <table className="booking-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    {b.userId?.firstname + " " + b.userId?.lastname ||
                      "Unknown"}
                  </td>
                  <td>{b.roomId?.type}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>{b.status}</td>
                  <td>₹{b.totalPrice}</td>
                  <td>
                    {(b.status === "booked" || b.status === "On-hold" )&& (
                      <>
                        <button
                          onClick={() => updateStatus(b._id, "completed")}
                        >
                          ✅ Complete
                        </button>
                        <button
                          onClick={() => deleteBooking(b._id, "cancelled")}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}

                    {b.status === "cancelled" && (
                      <span className="text-red-500">❌ Cancelled</span>
                    )}

                    {b.status === "completed" && (
                      <span className="text-green-600">✅ Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Pagination Controls */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Booking_management;
