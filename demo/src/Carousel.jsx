import React ,{ useState, useEffect } from "react";

function Carousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3; // Show 1 image at a time

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000); // Auto slide every 3 sec
    return () => clearInterval(interval);
  }, [images.length]);

  const goToIndex = (i) => setCurrentIndex(i);

  return (
    <div className="room-images-carousel-wrapper">
      <div
        className="room-images-carousel-track"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Room ${index}`}
            className="carousel-image"
          />
        ))}
      </div>

      {/* Dots */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
