import React from "react";
import "./FloatingImages.css";

const images = [
  {
    src: "\🌙 Ultimate Relaxation_ Luxury Massage Room Vibes 🌸.jpeg",
    alt: "Mountain View",
    width: 200,
    height: 250,
    top: "10%",
    left: "5%",
  },
  {
    src: "\Shangri-La Hotel Singapore ~ A Tranquil 5 Star Escape.jpeg",
    alt: "Dog Portrait",
    width: 280,
    height: 320,
    top: "40%",
    left: "20%",
  },
  {
    src: "\download.jpeg",
    alt: "River Flow",
    width: 220,
    height: 260,
    top: "20%",
    left: "50%",
  },
  {
    src: "/bar.jpeg",
    alt: "Forest Path",
    width: 250,
    height: 300,
    top: "60%",
    left: "70%",
  },
];

const FloatingImages = () => {
  return (
    <div className="floating-wrapper">
      <div className="floating-container">
        {images.map((img, index) => (
          <div
            key={index}
            className="floating-box"
            style={{
              width: img.width,
              height: img.height,
              top: img.top,
              left: img.left,
            }}
          >
            <img src={img.src} alt={img.alt} className="floating-image" />
          </div>
        ))}
      </div>

      {/* Description Box */}
      <div className="float-description-box">
        <h2>Facilities We Provide</h2>
        <p>
          Swimming Pool
          <br />
          Spa Services
          <br />
          Massage Services
          <br />
          Fitness Facilities
          <br />
          Dining & Bars
          <br />
          Business and Conference Facilities
          <br />
          Leisure and Entertainment Facilities
          <br />
          Specialty Services
        </p>
      </div>
    </div>
  );
};

export default FloatingImages;
