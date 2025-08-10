import React from "react";
import "./Highlights.css";
import {
  FaWifi,
  FaParking,
  FaUtensils,
  FaShuttleVan,
  FaDumbbell,
  FaCocktail,
  FaConciergeBell,
  FaCheckCircle,
  FaStar,
  FaCheck,
  FaLeaf
} from "react-icons/fa";

function Highlights() {
  return (
    <div className="highlight-section">
      <h2 className="highlight-title">Highlights</h2>

      {/* Feature Stats */}
      <div className="highlight-grid">
        <div className="highlight-box">
          <FaStar className="highlight-icon" />
          <div>
            <p className="highlight-heading">Great food & dining</p>
            <p className="highlight-desc">78% Positive • Based on guest reviews</p>
          </div>
        </div>

        <div className="highlight-box">
          <FaStar className="highlight-icon" />
          <div>
            <p className="highlight-heading">Great breakfast</p>
            <p className="highlight-desc">60% Positive • Based on guest reviews</p>
          </div>
        </div>

        <div className="highlight-box">
          <FaLeaf className="highlight-icon" />
          <div>
            <p className="highlight-heading">Hygiene Plus</p>
            <p className="highlight-desc">Cleaned with safety protocols</p>
          </div>
        </div>

        <div className="highlight-box">
          <FaCheckCircle className="highlight-icon" />
          <div>
            <p className="highlight-heading">Great for activities</p>
            <p className="highlight-desc">Popular with active guests</p>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <h3 className="highlight-subtitle">Facilities</h3>
      <div className="facility-icons">
        <span><FaWifi /> Free Wi-Fi</span>
        <span><FaParking /> Free Parking</span>
        <span><FaConciergeBell /> 24-hour Front Desk</span>
        <span><FaDumbbell /> Fitness Center</span>
        <span><FaUtensils /> Restaurant</span>
        <span><FaCocktail /> Bar</span>
        <span><FaShuttleVan /> Airport Transfer</span>
        <span><FaUtensils /> Kitchen</span>
      </div>
    </div>
  );
}

export default Highlights;
