// src/pages/User_Rooms.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./User_Room.css";
import Header from '../assets/Header';
import Footer from '../assets/Footer';
import axios from "axios";
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaUtensils,
  FaShower,
  FaFan,
  FaBed,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

function User_Rooms() {
  const location = useLocation();
  const navigate = useNavigate();
  const { availableRooms, searchDetails } = location.state || {};

  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const token = localStorage.getItem("token");

  const amenityIcons = {
    WiFi: <FaWifi title="WiFi" />,
    TV: <FaTv title="TV" />,
    AC: <FaSnowflake title="AC" />,
    Fridge: <FaUtensils title="Fridge" />,
    Shower: <FaShower title="Shower" />,
    Fan: <FaFan title="Fan" />,
    Bed: <FaBed title="Bed" />,
  };

  const handlePrev = (roomId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: Math.max((prev[roomId] || 0) - 1, 0),
    }));
  };

  const handleNext = (roomId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: Math.min((prev[roomId] || 0) + 1, totalImages - 1),
    }));
  };

  const handleWishlist = async (roomId) => {
    try {
      await axios.post(`/api/wishlist/${roomId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Room added to Wishlist");
    } catch (err) {
      console.error("Failed to add to wishlist", err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round(rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= rounded) {
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else if (i - 0.5 === rounded) {
        stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
      } else {
        stars.push(<FaRegStar key={i} color="#ccc" />);
      }
    }
    return stars;
  };

  if (!availableRooms) {
    return <p>No rooms data. Please search again from Home page.</p>;
  }

  return (
    <>
      <Header />
      <div className="user-room-list-container">
        <h2 style={{fontFamily: "Gloock, serif" ,color: "#7b5e57	" }}>
          Available Rooms from {searchDetails.checkIn} to {searchDetails.checkOut}
        </h2>

        <div className="user-room-list">
          {availableRooms.map((room) => {
            const currentIndex = currentImageIndex[room._id] || 0;
            const images = room.image_url || [];

            return (
              <div className="user-room-card" key={room._id}>
                <div className="user-room-image-container">
                  <button
                    className="user-nav-button left"
                    onClick={() => handlePrev(room._id)}
                    disabled={currentIndex === 0}
                  >
                    ‹
                  </button>
                  <img
                    src={images[currentIndex]}
                    alt={`Room ${room.type}`}
                    className="user-room-image"
                  />
                  <button
                    className="user-nav-button right"
                    onClick={() => handleNext(room._id, images.length)}
                    disabled={currentIndex === images.length - 1}
                  >
                    ›
                  </button>
                </div>

                {/* 2 Column Info Section */}
                <div className="user-room-info-columns">
                  <div className="user-info-left">
                    <h2>{room.type}</h2>
                    <p>{room.description}</p>
                    <div className="user-rating-stars">
                      {renderStars(room.averageRating || 0)}
                      <span className="user-rating-number">
                        ({room.averageRating || "0.0"})
                      </span>
                    </div>
                  </div>

                  <div className="user-info-right">
                    <p><strong>Price:</strong> ₹{room.price}</p>
                    <p><strong>Guests:</strong> {room.capacity}</p>
                    <div className="user-amenities-icons">
                      {room.amenities.map((item, index) => (
                        <span key={index} className="user-icon">
                          {amenityIcons[item] || item}
                        </span>
                      ))}
                    </div>
                    <div className="user-action-buttons">
                      <button className="user-wishlist_btn"
                        onClick={() => handleWishlist(room._id)}>
                        Add to Wishlist
                      </button>
                      <button
                        className="user-book-now-btn"
                        onClick={() =>
                          navigate(`/booking/${room._id}`, {
                            state: {
                              checkIn: searchDetails.checkIn,
                              checkOut: searchDetails.checkOut,
                              guests: searchDetails.guests,
                            },
                          })
                        }
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default User_Rooms;
