import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import axios from "axios";
import "./review.css";

const Review = ({ roomId, onReviewPosted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating > 0 && feedback.trim() !== "") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login to submit a review.");
          return;
        }

        const res = await axios.post(
          "/api/reviews",
          {
            roomId,
            rating,
            comment: feedback,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSubmitted(true);
        setRating(0);
        setFeedback("");

        if (onReviewPosted) onReviewPosted(res.data.review);
      } catch (err) {
        console.error("Review submission failed:", err);
        alert("You already reviewed this room.");
      }
    }
  };

  return (
    <motion.div
      className="review-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="review-title">Give Your Review</h2>

      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className={`star-icon ${
                (hover || rating) >= star ? "star-filled" : "star-empty"
              }`}
            />
          </motion.div>
        ))}
      </div>

      <textarea
        className="feedback-input"
        placeholder="Write your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={4}
      />

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </motion.div>

      {submitted && (
        <motion.div
          className="success-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Thank you for your feedback!
        </motion.div>
      )}
    </motion.div>
  );
};

export default Review;
