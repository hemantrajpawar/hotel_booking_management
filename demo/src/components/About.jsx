// AboutUs.jsx
import "./About.css";
import Header from '../assets/Header';
import Footer from '../assets/Footer';


const About = () => {
  return (
    <>
    <Header/>
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-text">
          <h1>Experience Comfort & Elegance</h1>
          <p>
            At Hotel Vyankatesh, we welcome you with warmth, luxury, and personalized hospitality. Whether for leisure or business, your perfect stay starts here.
          </p>
        </div>
        <div className="hero-media">
          <img src="\pexels-kelly-1179532-2869215.jpg" alt="Hotel Lobby" className="hero-image" />
        </div>
      </section>

      {/* Trusted Brands / Amenities */}
      <section className="brands-section">
        <h4>Our Trusted Partners</h4>
        <div className="brands-logos">
          <img src="\MMYT_BIG.png" alt="MakeMyTrip" />
          <img src="\Screenshot__1095_-removebg-preview-removebg-preview.png" alt="Goibibo" />
          <img src="\Screenshot__1094_-removebg-preview-removebg-preview.png" alt="Agoda" />
          <img src="\TRVG_BIG.png" alt="Trivago" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-box">
          <h2>50k+</h2>
          <p>Happy Guests</p>
        </div>
        <div className="stat-box">
          <h2>500+</h2>
          <p>Room Nights Booked</p>
        </div>
        <div className="stat-box">
          <h2>95%</h2>
          <p>Guest Satisfaction</p>
        </div>
        <div className="stat-box">
          <h2>4.8</h2>
          <p>Average Rating</p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h3>Why Choose Hotel Vyankatesh</h3>
        <p>
          From cozy rooms and delicious cuisine to prime location and 24/7 hospitality, we offer everything you need for a seamless stay. Our guests love us for our attention to detail and dedication to comfort.
        </p>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h3>Meet Our Team</h3>
        <div className="team-grid">
          {[
            { name: "Hemant Pawar", title: "General Manager" },
            { name: "Laptop Buddy", title: "Backend Support & Deployment Engineer" },
            { name: "GPT Kumar ", title: "Helper" },
          ].map((member, i) => (
            <div className="team-card" key={i}>
              <h4>{member.name}</h4>
              <p>{member.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default About;
