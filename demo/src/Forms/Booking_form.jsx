// src/pages/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Booking_form.css";

function Booking_form() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [GstTax, setGstTax] = useState(0);
  const [ServiceTax, setServiceTax] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Prefill form if state exists (from Room "Book Now")
  useEffect(() => {
    if (location.state) {
      const { checkIn, checkOut, guests } = location.state;
      if (checkIn) setCheckIn(checkIn);
      if (checkOut) setCheckOut(checkOut);
      if (guests) setGuests(guests);
    }
  }, [location.state]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`/api/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoom(res.data);
      } catch (err) {
        console.error("Failed to load room", err);
      }
    };

    fetchRoom();
  }, [roomId]);

  //  Calculate total price
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const nights =
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
      if (nights > 0) {
        const basePrice = nights * room.price;
        const gst = Math.floor(basePrice * 0.18);
        const service = Math.floor(basePrice * 0.07);
        const total = basePrice + gst + service;

        setGstTax(gst);
        setServiceTax(service);
        setTotalPrice(total);

        console.log("Gst :", gst);
        console.log("Service :", service);
        console.log("totalPrice :", total);
      } else {
        setGstTax(0);
        setServiceTax(0);
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, room]);

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Please fill all fields.");
      return;
    }

    if (!token) {
      alert("Please login to book a room.");
      navigate("/login");
      return;
    }

    try {
      // Step 1: Get order from backend
      const { data } = await axios.post(
        "/api/payment/Booking_payment",
        { totalPrice },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { id: order_id, amount, currency } = data.data;

      // Step 2: Launch Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ Store in .env file
        amount,
        currency,
        name: "Hemant Pawar",
        description: "Room Booking Payment",
        order_id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          console.log("Razorpay Response:", response);

          const verifyPayload = {
            transactionId: razorpay_payment_id,
            payment_orderId: razorpay_order_id,
            payment_signature: razorpay_signature,
            bookingDetails: {
              roomId,
              checkIn,
              checkOut,
              guests,
              totalPrice,
            },
          };

          await axios.post("/api/payment/verify", verifyPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          alert(
            "Booking & Payment successful! , Please Check Your Inbox for Booking Bill "
          );
          navigate("/my-bookings");
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment initiation failed.");
    }
  };

  return (
    <div className="booking-form-container">
      <h2>Book Your Stay</h2>

      {room ? (
        <>
          <div className="booking-container">
            <div className="left-section">
              <div className="room-summary">
                <h3>
                  {room.title} ({room.type})
                </h3>
                <p>
                  <strong>Price per Night:</strong> ₹{room.price}
                </p>
                <p>
                  <strong>Guests:</strong> {room.capacity} guests
                </p>
              </div>

              <form
                className="booking-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <label>Check-In Date:</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />

                <label>Check-Out Date:</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn}
                  required
                />

                <div className="price-breakdown">
                  <div className="label-col">
                    <p>
                      <strong>Base Price:</strong>
                    </p>
                    <p>
                      <strong>Service Tax (7%):</strong>
                    </p>
                    <p>
                      <strong>GST (18%):</strong>
                    </p>
                    <p
                      style={{
                        borderTop: "2px solid #ccc", // or any color you prefer
                        paddingTop: "8px", // optional, for spacing
                        marginTop: "5px",
                      }}
                    >
                      <strong>Total Price:</strong>
                    </p>
                  </div>
                  <div className="value-col">
                    <p>₹{room.price}</p>
                    <p>₹{ServiceTax}</p>
                    <p>₹{GstTax}</p>
                    <p
                      style={{
                        borderTop: "2px solid #ccc", // or any color you prefer
                        paddingTop: "8px", // optional, for spacing
                        marginTop: "5px",
                      }}
                    >
                      ₹{totalPrice > 0 ? totalPrice : "--"}
                    </p>
                  </div>
                </div>

                <p className="booking-note">
                  This rate is non-refundable and cannot be changed or cancelled
                  — if you do choose to change or cancel this booking you will
                  not be refunded any of the payment.
                </p>
              </form>
            </div>

            <div className="right-section">
              <form className="user-details-form">
                <h4>Guest Information</h4>

                <div className="name-group">
                  <input type="text" placeholder="First Name *" required />
                  <input type="text" placeholder="Last Name *" required />
                </div>

                <input type="email" placeholder="Email Address *" required />

                <div className="mobile-group">
                  <select defaultValue="+91">
                    <option value="+91">+91 (India)</option>
                    <option value="+1">+1 (USA)</option>
                    <option value="+44">+44 (UK)</option>
                    {/* Add more country codes as needed */}
                  </select>
                  <input type="tel" placeholder="Mobile Number *" required />
                </div>

                <p className="note">
                  All SMS notifications related to your booking will be sent to
                  this mobile number.
                </p>

                <h4>Billing Address</h4>
                <input
                  type="text"
                  placeholder="Country *"
                  defaultValue="India"
                  required
                />
                <input type="text" placeholder="Street Address *" required />
                <input type="text" placeholder="City *" required />
                <input
                  type="text"
                  placeholder="Billing ZIP/Postal Code *"
                  required
                />

                <button type="button" onClick={handleBooking}>
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <p>Loading room data...</p>
      )}
    </div>
  );
}

export default Booking_form;
