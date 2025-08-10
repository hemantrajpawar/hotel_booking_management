import React from "react";
import "./images.css"; // Import the CSS file

const images = [
  { src: "\Gallery of KC Grande Resort & Spa-Hillside _ Foundry of Space  - 12.jpeg", alt: "Vintage Car" },
  { src: "\Galería de Hotel Dua _ Koan Design  - 16.jpeg", alt: "Scenic View" },
  { src: "\How to Design Stunning Hotel Interiors That Impress Guests _ Tanic Design.jpeg", alt: "Forest Path" },
  { src: "\秋の京都 ROKU KYOTO ホテル宿泊記.jpeg", alt: "Black Dog" },
  { src: "\Bedroom Guest Room Five Star Hotel Background, Bedroom, Guest Room, Hotel Background Image And Wallpaper for Free Download.jpeg", alt: "Abstract Art" }
];

const Images = () => {
  return (
    <div className="image">
      {/* 🔹 Title with Gradient Motion */}
      <span className="images-title">Discover the beauty of Hotel with our gallery</span>

      <div className="image-container">
        <div className="image-track">
          {/* 🔹 Duplicate images to create a seamless loop */}
          {[...images, ...images].map((item, index) => (
            <div key={index} className="image-box">
              <img src={item.src} alt={item.alt} className="effect-image" />
              <div className="image-overlay"></div>
            </div>
          ))}
          {/* 🔹 Description Box in Loop */}
          <span className="description-box">
            <h2>Discover Your Next Destination</h2>
            <p>Explore breathtaking views, cozy stays, and memorable adventures.</p>
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default Images;
