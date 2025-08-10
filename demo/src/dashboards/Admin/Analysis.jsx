import React, { useEffect, useState, useCallback,useMemo } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // for dateClick
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Analysis.css"; // optional styling

function Analysis() {
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [occupancyRate, setOccupancyRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const token=localStorage.getItem("token");

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get("/api/analytics/admin/",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      const { monthlyBookings, occupancyRate } = res.data;

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      // Convert raw data to chart-friendly format
      const formatted = monthlyBookings.map((item) => ({
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        bookings: item.count,
      }));

      setMonthlyBookings(formatted);
      setOccupancyRate(occupancyRate.toFixed(2)); // show 2 decimal places
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  //calender
  const [bookings, setBookings] = useState([]);
  const [calenderloading, setcalenderLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get("/api/bookings/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    } finally {
      setcalenderLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const events = useMemo(() => {
    return bookings.map((b) => ({
      id: b._id,
      title: `${b.user?.name || "Unknown"} - ${b.room?.type || "Room"}`,
      start: b.checkInDate,
      end: new Date(new Date(b.checkOutDate).getTime() + 86400000), // Full end day
      color:
        b.status === "completed"
          ? "#28a745"
          : b.status === "cancelled"
          ? "#dc3545"
          : "#007bff",
    }));
  }, [bookings]);

  return (
    <div className="admin-analytics">
      <h2 className="dashboard-title">📊 Analytics Dashboard</h2>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          <div className="occupancy-box">
            <h3>🏨 Occupancy Rate</h3>
            <p>{occupancyRate}%</p>
          </div>

          <div className="chart-container">
            <h3>📅 Monthly Bookings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}


<div className="admin-calendar">
      <h2 className="dashboard-title">📅 Booking Calendar</h2>
      {calenderloading ? (
        <p>Loading calendar...</p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          eventDisplay="block"
        />
      )}
    </div>
    </div>
  );
}

export default Analysis;
