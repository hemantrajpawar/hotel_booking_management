import "./Events.css";
import { motion } from "framer-motion";
import Header from '../assets/Header';
import Footer from '../assets/Footer';
function Events() {
  return (
    <>
    <Header/>
      <div className="event-header-image">
        <h1>Events & Conference</h1>
      </div>
      <div className="event-card-container">
        <div className="event-card">
          {/* Image Section */}
          <div className="event-card-image">
            <img src="\Wedding Flame.jpeg" alt="Nature" />
          </div>

          {/* Description Section (Scroll Animation) */}
          <motion.div
            className="event-card-content"
            initial={{ y: 50, opacity: 0 }} // Start below and hidden
            whileInView={{ y: 0, opacity: 1 }} // Move up when in view
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% in view
          >
            <h2>Wedding</h2>
            <p>
              Celebrate love in grandeur at our Hotel , where elegance meets
              perfection. Our luxurious venues, exquisite decor, and exceptional
              hospitality create the perfect setting for your fairy-tale
              wedding.
              <br></br>
              <br></br>
              <strong>Why Choose Us?</strong>
              <br></br>- Stunning indoor & outdoor wedding venues
              <br></br>- Customizable decor & theme options
              <br></br>- Gourmet catering with diverse menu choices
              <br></br>- Dedicated wedding planners for a hassle-free experience
              <br></br>- Luxury accommodations for guests
            </p>
          </motion.div>
        </div>
      </div>
      <div className="event-card-container">
        <div className="event-card">
          {/* Description Section (Left Side) */}
          <motion.div
            className="event-card-content"
            initial={{ y: 50, opacity: 0 }} // Start below and hidden
            whileInView={{ y: 0, opacity: 1 }} // Move up when in view
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% in view
          >
            <h2>BirthDay</h2>
            <p>
              Make your birthday unforgettable with a grand celebration at our
              hotel, where luxury meets festivity! Whether you're planning an
              intimate gathering or a lavish party, we offer the perfect venue,
              exquisite décor, and top-notch hospitality to make your special
              day truly magical.
              <br />
              <br />
              <strong>Why Celebrate With Us?</strong>
              <br />
              - Elegant indoor & outdoor party venues
              <br />
              - Customizable decor & theme options
              <br />
              - Delicious gourmet catering & personalized menus
              <br />
              - Live music, DJ, & entertainment options
              <br />- Luxury accommodations for you & your guests
            </p>
          </motion.div>

          {/* Image Section (Right Side) */}
          <div className="event-card-image">
            <img src="\Birthday Balloon For Women Garland Kit Arch And Gold For Party Decoration Neutral Brown Boho Ivory White Sand Gold.jpeg" alt="Wedding Event" />
          </div>
        </div>
      </div>
      <div className="event-card-container">
        <div className="event-card">
          {/* Image Section */}
          <div className="event-card-image">
            <img src="\35 Gorgeous Ideas for Using String Lights At Your Wedding_ Hanging Light Ceiling.jpeg" alt="Nature" />
          </div>

          {/* Description Section (Scroll Animation) */}
          <motion.div
            className="event-card-content"
            initial={{ y: 50, opacity: 0 }} // Start below and hidden
            whileInView={{ y: 0, opacity: 1 }} // Move up when in view
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% in view
          >
            <h2>Party</h2>
            <p>
            Get ready to party in style at our luxurious hotel, where every celebration turns into an unforgettable experience! Whether it's a corporate gathering, a private bash, or a festive night with friends, we provide the perfect ambiance, gourmet cuisine, and top-tier entertainment to make your event truly spectacular.
              <br></br>
              <br></br>
              <strong> What Sets Us Apart?</strong> 
              <br></br>- Curated menus featuring world-class cuisine and signature drinks
              <br></br>-  Elegant accommodations for a truly indulgent experience.
              <br></br>- Gourmet catering with diverse menu choices
              <br></br>-  Dedicated event specialists to handle every detail.
              <br></br>- Luxury accommodations for guests
            </p>
          </motion.div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Events;