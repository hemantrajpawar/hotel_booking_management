import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./Feedback.css";
import { FaStar } from "react-icons/fa";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviews/");
        const mapped = res.data.map((r) => ({
          id: r._id,
          name: `${r.userId?.firstname || "Anonymous"} ${r.userId?.lastname || ""}`,
          feedback: r.comment,
          roomTitle: r.roomId?.type || "Unknown Room",
          image: r.userId?.profilePhoto || "/default-avatar.png",
          rating: r.rating || 0, // ✅ Add this line
        }));
        
        setFeedbacks(mapped);
      } catch (err) {
        console.warn("Error fetching reviews", err);
      }
    };

    fetchReviews();
  }, []);

  // Auto-scroll every 2 seconds
  useEffect(() => {
    if (feedbacks.length < 2) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [feedbacks.length]);

    return (
      <div className="feedback-section">
        <div className="feedback-bg"></div>
    
        <div className="carousel-container">
          <motion.div
            className="carousel-track"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.8 }}
          >
            {feedbacks.map((item) => (
              <div className="feedback-card" key={item.id}>
                <h3 className="room-title">Room: {item.roomTitle}</h3>
                <p className="feedback-text">"{item.feedback}"</p>
    
                <div className="reviewer-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="customer-img"
                  />
                  <div className="reviewer-info">
                    <p className="reviewer-name">{item.name}</p>
                    <div className="star-rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={i < item.rating ? "filled-star" : "empty-star"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
    
        {feedbacks.length > 1 && (
          <div className="carousel-dots">
            {feedbacks.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active-dot" : ""}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        )}
      </div>
    );
};

export default Feedback;
