// Contact.jsx
import "./Contact.css";
import Header from '../assets/Header';
import Footer from '../assets/Footer';

const ContactPage = () => {
  return (
    <>
    <Header/>
    <div className="contact-page">
      <h2 className="contact-title">Get in touch with us</h2>
      <p className="contact-subtitle">
        Fill out the form below or call us directly to plan your perfect stay with us.
      </p>

      <div className="contact-container">
        {/* Contact Form */}
        <form className="contact-form">
          <label>Name</label>
          <input type="text" placeholder="Your name" required />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Message</label>
          <textarea placeholder="Enter your message" rows="5" required />

          <div className="terms">
            <input type="checkbox" required ></input>
            <span>I agree with the Terms and Conditions</span>
          </div>

          <button type="submit" className="submit-btn">Send My Request</button>
        </form>

        {/* Info Panel */}
        <div className="contact-info">
          <h4>Why contact us?</h4>
          <ul>
            <li>✔ Check availability or make a reservation</li>
            <li>✔ Request room details or special packages</li>
            <li>✔ Ask about group bookings or events</li>
            <li>✔ Share feedback or special requests</li>
          </ul>

          <div className="contact-address">
            <h5>Our Locations</h5>
            <p><strong>Panchgani (Main Branch):</strong><br />
              Hotel Vyankatesh, Near Table Land<br />
              Panchgani, Maharashtra 412805</p>

            <p><strong>Contact:</strong><br />
               hotelvyankatesh@gmail.com<br />
               +91 9876543210</p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ContactPage;
