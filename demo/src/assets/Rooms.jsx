import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "./Rooms.css";
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaUtensils,
  FaShower,
  FaFan,
  FaBed,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const roomsPerPage = 2;

  // Carousel indexes per room (object with roomId keys)
  const [carouselIndexes, setCarouselIndexes] = useState({});

  const amenityIcons = {
    WiFi: <FaWifi title="WiFi" />,
    TV: <FaTv title="TV" />,
    AC: <FaSnowflake title="AC" />,
    Fridge: <FaUtensils title="Fridge" />,
    Shower: <FaShower title="Shower" />,
    Fan: <FaFan title="Fan" />,
    Bed: <FaBed title="Bed" />,
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

  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        const res = await axios.get("/api/rooms");
        const available = res.data.filter((room) => room.isAvailable);
        setRooms(available);
        setAvailableRooms(available);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchAllRooms();
  }, []);

  // Auto-slide carousel for each room every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndexes((prev) => {
        const updated = { ...prev };
        availableRooms.forEach((room) => {
          const currentIndex = prev[room._id] || 0;
          updated[room._id] = (currentIndex + 1) % (room.image_url?.length || 1);
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [availableRooms]);

  if (!rooms || rooms.length === 0) {
    return <p>Rooms are not available yet !!!</p>;
  }

  const totalRooms = availableRooms.length;
  const totalPages = Math.ceil(totalRooms / roomsPerPage);
  const lastIndex = currentPage * roomsPerPage;
  const firstIndex = lastIndex - roomsPerPage;
  const paginatedRooms = availableRooms.slice(firstIndex, lastIndex);

  return (
    <div className="avarooms-container">
      <h2 className="avarooms-title-main">Your Luxurious Stay Begins Here</h2>

      <div className="avarooms-grid">
        {paginatedRooms.map((room) => {
          const images = room.image_url || [];
          const index = carouselIndexes[room._id] || 0;

          return (
            <div className="avacard-wrapper" key={room._id}>
              <div className="avaroom-card">
                <div className="avaroom-carousel">
                  <div
                    className="avaroom-carousel-inner"
                    style={{
                      width: `${images.length * 100}%`,
                      transform: `translateX(-${index * (100 / images.length)}%)`,
                    }}
                  >
                    {images.map((src, i) => (
                      <div className="avaroom-carousel-image-wrapper" key={i}>
                        <img src={src} alt={`Room image ${i + 1}`} />
                      </div>
                    ))}
                  </div>

                  <div className="avaroom-carousel-dots">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`avaroom-carousel-dot ${index === i ? "active" : ""}`}
                        onClick={() =>
                          setCarouselIndexes((prev) => ({
                            ...prev,
                            [room._id]: i,
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="avaroom-info">
                  <h1
                    style={{
                      alignSelf: "center",
                      color: "#333",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {room.type}
                  </h1>
                  <p className="avaroom-desc">{room.description}</p>

                  <div className="avarating-stars">
                    {renderStars(room.averageRating || 0)}
                    <span className="avarating-number">({room.averageRating || "0.0"})</span>
                  </div>

                  <p>
                    <strong>Price:</strong> ₹{room.price}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {room.capacity} people
                  </p>

                  <div className="avaamenities-icons">
                    {(room.amenities || []).map((item, i) => (
                      <span key={i} className="icon">
                        {amenityIcons[item] || item}
                      </span>
                    ))}
                  </div>

                  <button onClick={() => navigate(`/specific/${room._id}`)}>Explore</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="avapagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Rooms;
