import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("/api/wishlist/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error("Error fetching wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (roomId) => {
    try {
      await axios.delete(`/api/wishlist/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWishlist(wishlist.filter((room) => room._id !== roomId));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-page">
      <h2> My Wishlist</h2>

      {loading ? (
        <p>Loading...</p>
      ) : wishlist.length === 0 ? (
        <p>No rooms in wishlist.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((room) => (
            <div className="wishlist-card" key={room._id}>
              <img src={room.image_url[0]} alt={room.title} />
              <div className="card-content">
                <h3>{room.title}</h3>
                <p>{room.description.slice(0, 100)}...</p>
                <p><strong>Price:</strong> ₹{room.price}</p>
                <button onClick={() => removeFromWishlist(room._id)}> Remove</button>
                <button className="explore-btn" onClick={()=>navigate(`/specific/${room._id}`) } >Explore</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
