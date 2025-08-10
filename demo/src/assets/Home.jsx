import React, { useState } from "react";
import "./home.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayISO = today.toISOString().split("T")[0];
  const tomorrowISO = tomorrow.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(todayISO);
  const [checkOut, setCheckOut] = useState(tomorrowISO);
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert("Check-out must be after check-in date");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to continue");
        navigate("/login");
        return; // Exit the function early
      }

      const res = await axios.get(
        `/api/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      console.log("Available Rooms:", res.data);

      // Redirect to room page with state
      navigate("/user_rooms", {
        state: {
          availableRooms: res.data,
          searchDetails: { checkIn, checkOut, guests },
        },
      });
    } catch (err) {
      console.error("Error fetching available rooms", err);
      alert("Error fetching available rooms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-container-home">
      <span className="lavious">LAVIOUS</span>
      <div className="quote">Where Luxury Meets Comfort</div>

      <form onSubmit={handleSearch} className="home-booking-form">
        <div className="home-booking-fields">
          <div>
            <label>Check-In:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Check-Out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Guests:</label>
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Finding Rooms..." : "Find Available Rooms"}
        </button>
      </form>
    </div>
  );
}

export default Home;
