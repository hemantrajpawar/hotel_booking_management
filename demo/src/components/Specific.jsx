// RoomDetails.jsx (Updated with correct booking handler)
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {openDB} from "idb";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import {
  FaStar,
  FaWifi,
  FaTv,
  FaBed,
  FaUtensils,
  FaCar,
  FaBath,
  FaSwimmingPool,
  FaSpa,
  FaConciergeBell,
} from "react-icons/fa";
import Header from "../assets/Header";
import Footer from "../assets/Footer";
import "./Specific.css";

// Initialize socket connection
const socket = io("http://localhost:5000"); // Your backend server URL

const amenitiesMap = {
  wifi: <FaWifi />,
  tv: <FaTv />,
  bed: <FaBed />,
  breakfast: <FaUtensils />,
  parking: <FaCar />,
  bath: <FaBath />,
  pool: <FaSwimmingPool />,
  spa: <FaSpa />,
  service: <FaConciergeBell />,
};

const Specific = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const token=localStorage.getItem("token");

  // State variables
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guests, setGuests] = useState(1);

  const [isHeld, setIsHeld] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [db, setDb] = useState(null);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [checkIn, setCheckIn] = useState(today.toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(
    tomorrow.toISOString().split("T")[0]
  );


  const goToIndex = (index) => {
    setCurrentIndex(index);
  };



  useEffect(() => {
    if (!roomId) return; // Don't do anything if we don't have a roomId

    socket.connect();
    socket.emit('join-room-view', roomId);

    const handleStatusUpdate = (data) => {
      if (data.roomId === roomId) {
        if (data.status === 'On-hold') {
          setIsHeld(true);
          const expires = new Date(data.holdExpires).getTime();
          const now = Date.now();
          setCountdown(Math.round((expires - now) / 1000));
        } else {
          setIsHeld(false);
          setCountdown(0);
        }
      }
    };

    socket.on('room-status-update', handleStatusUpdate);

    // Cleanup function when component unmounts or roomId changes
    return () => {
      socket.emit('leave-room-view', roomId);
      socket.off('room-status-update', handleStatusUpdate);
      socket.disconnect();
    };
  }, [roomId]);


  useEffect(() => {
    if (!isHeld || countdown <= 0) {
      if (countdown <= 0) setIsHeld(false);
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isHeld, countdown]);

  // Fetch initial room, user, and review data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect if not logged in
      return;
    }

    const fetchRoomAndReviews = async () => {
      try {
        const roomRes = await axios.get(`/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoom(roomRes.data);

        const decodeuser = jwtDecode(token);
        const userId = decodeuser.id;
        const userRes = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const reviewsRes = await axios.get(`/api/reviews/${roomId}`);
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      } catch (err) {
        console.error("Failed to fetch room, user, or reviews", err);
      }
    };
    fetchRoomAndReviews();
  }, [roomId, navigate]);

 useEffect(() => {
    // Setup IndexedDB
    const setupDB = async () => {
      const database = await openDB('booking-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('offline-bookings')) {
            db.createObjectStore('offline-bookings', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
      setDb(database);
    };
    setupDB();

    // Listen to online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- Main Booking Handler ---
  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      alert("You must be logged in to book a room.");
      navigate("/login");
      return;
    }

    // Online Booking Flow
    if (isOnline) {
      try{
      navigate(`/booking/${room._id}`, {
        state: {
          checkIn,
          checkOut,
          guests,
          totalPrice:
            room.price +
            Math.floor(room.price * 0.07) +
            Math.floor(room.price * 0.18),
        },
      });
    }
    catch(err){
      console.error('Server is unreachable, saving offline.', error);
       // saveBookingOffline(bookingData);
    }
    } else {
      // Offline Booking Flow (Provisional Booking)
      try {
        const bookingData = {
          userEmail: user.email,
          userName: `${user.firstname} ${user.lastname}`,
          roomId: room._id,
          roomType: room.type,
          checkIn: checkIn,
          checkOut: checkOut,
          totalPrice:
            room.price +
            Math.floor(room.price * 0.07) +
            Math.floor(room.price * 0.18),
          guests: guests,
          timestamp: Date.now(),
          status: "On-hold",
        };

        await saveBookingOffline(bookingData)

        alert(
          "You are offline. Your booking request is saved and will be processed automatically when you're back online."
        );
      } catch (error) {
        console.error("Could not save booking for offline sync:", error);
        alert("There was an error saving your offline booking request.");
      }
    }



  const saveBookingOffline = async (bookingData) => {
    if (!db) {
        alert('Database not ready. Please try again.');
        return;
    }
    const tx = db.transaction('offline-bookings', 'readwrite');
    await tx.store.add(bookingData);
    await tx.done;
    console.log('Booking saved offline:', bookingData);

    // Register background sync
    if ('SyncManager' in window) {
      const swRegistration = await navigator.serviceWorker.ready;
      await swRegistration.sync.register('sync-new-bookings');
      console.log('Background sync registered.');
    }
  };

  };

  // Function to format the countdown timer
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    const checkReviewPermission = async () => {
      try {
        const res = await axios.get(`/api/reviews/check/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCanReview(res.data.canReview);
      } catch (err) {
        console.error("Error checking review permission", err);
      }
    };
    checkReviewPermission();
  }, [roomId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post(
        "/api/reviews/",
        { roomId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted successfully");
      setRating(0);
      setComment("");
      setHover(null);
      const reviewsRes = await axios.get(`/api/reviews/${roomId}`);
      setReviews(reviewsRes.data);
      setCanReview(false);
    } catch (err) {
      console.error("Review submission error:", err);
      alert(err.response?.data?.msg || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  

  if (!room || !user || typeof room !== "object" || !room._id) {
    return <p>Loading!</p>;
  }

  return (
    <>
      <Header />
      <div className="room-detail-wrapper">
        <div className="room-detail-container">
          {/* LEFT */}
          <div className="room-left">
            {/* IMAGE PAGINATION SECTION (Only 3 per page) */}
            <div className="room-images-carousel">
              {room.image_url
                ?.slice(currentIndex * 3, currentIndex * 3 + 3)
                .map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Room ${index}`}
                    className="carousel-image"
                  />
                ))}
            </div>

            {/* PAGINATION DOTS */}
            <div className="specific-carousel-dots">
              {Array.from({
                length: Math.ceil(room.image_url.length / 3),
              }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => goToIndex(pageIndex)}
                  style={{
                    width: "10px",
                    height: "10px",

                    padding: "0",
                    margin: "4px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor:
                      pageIndex === currentIndex ? "#333" : "#ccc",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                ></button>
              ))}
            </div>

            <div className="specific-room-info">
              <h2 className="room-type">{room.type}</h2>

              <h3 className="room-title">{room.title}Room</h3>

              <p className="room-desc">{room.description}</p>

              <div className="room-info-list">
                <p>
                  <strong>Capacity:</strong> {room.capacity} Guests
                </p>
                <p>
                  <strong>Available:</strong> {room.isAvailable ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < room.averageRating ? "#ffc107" : "#e4e5e9"}
                />
              ))}
              <span> ({room.totalReviews} reviews)</span>
            </div>

            <div className="amenities">
              <h4>Amenities:</h4>
              <div className="amenities-icons">
                {room.amenities?.map((item, i) => (
                  <span key={i} className="amenity-icon">
                    {amenitiesMap[item.toLowerCase()] || item}
                    <span className="amenity-label">{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="room-right">
            <div className="room-info-card">
              <h3>
                ₹{room.price}
                <small style={{ fontWeight: "lighter" }}>/night</small>
              </h3>

              {/* Booking Form */}
              <div className="booking-form">
                <label>
                  Check-in:
                  <input
                    type="date"
                    style={{ fontFamily: "Forum, serif" }}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </label>
                <label>
                  Check-out:
                  <input
                    type="date"
                    style={{ fontFamily: "Forum, serif" }}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </label>
                <label>
                  Guests:
                  <input
                    type="number"
                    min="1"
                    style={{
                      fontFamily: "Forum, serif",
                      fontWeight: "lighter",
                    }}
                    max={room.capacity}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </label>

                {/* Price Calculation */}
                <div className="specif-price-breakdown">
                  <p>
                    <span>Base Price</span>
                    <span>₹{room.price}</span>
                  </p>
                  <p>
                    <span>Service Tax (7%)</span>
                    <span>₹{Math.floor(room.price * 0.07)}</span>
                  </p>
                  <p>
                    <span>GST (18%)</span>
                    <span>₹{Math.floor(room.price * 0.18)}</span>
                  </p>
                  <hr />
                  <strong>
                    <span>Total</span>
                    <span>
                      ₹
                      {room.price +
                        Math.floor(room.price * 0.07) +
                        Math.floor(room.price * 0.18)}
                    </span>
                  </strong>
                </div>

                {/* Conditional Button: Countdown or Book Now */}
                {isHeld ? (
                  <div className="on-hold-message">
                    <p>Room is on hold for:</p>
                    <p className="countdown-timer">
                      {formatCountdown(countdown)}
                    </p>
                  </div>
                ) : (
                  <button className="book-now-button" onClick={handleBooking}>
                    {navigator.onLine ? "Proceed to Book" : "Book Offline"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="reviews-section">
          <h3 className="review-heading">User Reviews</h3>
          {reviews.length ? (
            reviews.map((review, i) => (
              <div key={i} className="review-box">
                {/* First line: Quoted comment */}
                <blockquote className="review-quote">
                  “{review.comment}”{/* Stars */}
                  <div className="review-stars">
                    {[...Array(5)].map((_, j) => (
                      <FaStar
                        key={j}
                        color={j < review.rating ? "#ffc107" : "#e4e5e9"}
                      />
                    ))}
                  </div>
                </blockquote>

                {/* Row of 3 items */}
                <div className="review-details-row">
                  {/* User Name */}
                  <div className="review-user-name">
                    <strong>
                      {review?.userId?.firstname} {review?.userId?.lastname}
                    </strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        {/* ADD REVIEW */}
        {canReview && (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h4 style={{fontFamily:" Georgia, serif"}}>Leave a Review...</h4>
            <div className="star-input">
              {[...Array(5)].map((_, i) => {
                const idx = i + 1;
                return (
                  <label key={idx}>
                    <input
                      type="radio"
                      name="rating"
                      value={idx}
                      onClick={() => setRating(idx)}
                      style={{ display: "none" }}
                    />
                    <FaStar
                      size={24}
                      color={idx <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onMouseEnter={() => setHover(idx)}
                      onMouseLeave={() => setHover(null)}
                      style={{ cursor: "pointer" }}
                    />
                  </label>
                );
              })}
            </div>
            <textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="submit-review-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Specific;
