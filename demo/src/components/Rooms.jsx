import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";
import "./styles.css"; // Ensure this points to your updated CSS file
import Header from "../assets/Header";
import Footer from "../assets/Footer";

const roomTypes = ["single", "double", "deluxe", "premium deluxe", "suite"];

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([4000, 15700]);
  const [minCapacity, setMinCapacity] = useState(1);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 4;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomsAndReviews = async () => {
      try {
        const roomsRes = await axios.get("/api/rooms/");
        const reviewsRes = await axios.get("/api/reviews/");
        setRooms(roomsRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchRoomsAndReviews();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const titleMatch = room.title.toLowerCase().includes(search.toLowerCase());
    const descMatch = room.description
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const priceMatch =
      room.price >= priceRange[0] && room.price <= priceRange[1];
    const capacityMatch = room.capacity >= minCapacity;
    const availabilityMatch = !availableOnly || room.isAvailable;

    return (
      (titleMatch || descMatch) &&
      priceMatch &&
      capacityMatch &&
      availabilityMatch
    );
  });

  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <div className="real-all-rooms-container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by title/description"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "250px",
            }}
          />

          {/* Price Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontWeight: "500" }}> Price Range:</label>
            <select
              value={priceRange[1]}
              onChange={(e) => {
                const selected = parseInt(e.target.value);
                setPriceRange([4000, selected]);
              }}
              style={{
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            >
              <option value="6000">₹4000 - ₹6000</option>
              <option value="10000">₹6000 - ₹10000</option>
              <option value="15000">₹10000 - ₹15000</option>
              <option value="20000">₹15000 - ₹20000</option>
              <option value="25000">₹20000 - ₹25000</option>
            </select>
          </div>

          {/* Min Capacity */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontWeight: "500" }}>Guests:</label>
            <input
              type="number"
              min="1"
              value={minCapacity}
              onChange={(e) => setMinCapacity(parseInt(e.target.value))}
              style={{
                width: "60px",
                padding: "6px 8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* Available Rooms */}
          <div style={{ display: "flex", gap: "8px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={() => setAvailableOnly(!availableOnly)}
              />
              Only Available Rooms
            </label>
          </div>
        </div>

        {/* Group by Room Type */}
        {roomTypes.map((type) => {
          const roomsOfType = currentRooms.filter(
            (room) => room.type?.toLowerCase() === type.toLowerCase()
          );

          return roomsOfType.length > 0 ? (
            <div key={type} className="real-room-type-section">
              <h2 className="real-room-type-title">{type.toUpperCase()} ROOMS</h2>
              <div className="real-rooms-grid">
                {roomsOfType.map((room) => {
                  return (
                    <div key={room._id} className="real-room-card">
                      <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                        loop={true}
                        modules={[Pagination, Autoplay]}
                        className="real-carousel"
                      >
                        {room.image_url?.map((url, i) => (
                          <SwiperSlide key={i}>
                            <img
                              src={url}
                              alt="room"
                              className="real-carousel-img"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      <div className="real-room-info">
                        <h3>{room.title}</h3>
                        <p>
                          <strong>Type:</strong> {room.type}
                        </p>
                        <p>
                          <strong>Capacity:</strong> {room.capacity} Guests
                        </p>
                        <p>
                          <strong>Availability:</strong>{" "}
                          <span
                            style={{
                              color: room.isAvailable ? "green" : "red",
                            }}
                          >
                            {room.isAvailable ? "Yes" : "No"}
                          </span>
                        </p>
                        <p>
                          <strong>Price:</strong> ₹{room.price}
                        </p>

                        <div className="real-rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              color={
                                i < room.averageRating ? "#ffc107" : "#e4e5e9"
                              }
                            />
                          ))}
                          <span> ({room.totalReviews} reviews)</span>
                        </div>

                        <button
                          className="real-book-now-button"
                          disabled={!room.isAvailable}
                          onClick={() => navigate(`/specific/${room._id}`)}
                        >
                          Book at: ₹{room.price}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null;
        })}

        {/* Pagination */}
        <div className="real-pagination">
          {Array.from({
            length: Math.ceil(filteredRooms.length / roomsPerPage),
          }).map((_, i) => (
            <button
              key={i}
              className={`real-page-btn ${
                currentPage === i + 1 ? "real-active" : ""
              }`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Rooms;