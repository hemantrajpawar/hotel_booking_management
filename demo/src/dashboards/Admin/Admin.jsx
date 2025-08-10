import React from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ named import
import "./Admin.css";

function Admin() {
  const token = localStorage.getItem("token");
  let role = null; //  Declare it first

  if (token) {
    try {
      const decoded = jwtDecode(token); // token must contain { id, role }
      role = decoded.role;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  if (role !== "admin"){ 
    console.log(role);
    return <Navigate to="/" />;
}

  return (
    <div className="admin-dashboard">
      <h2>Admin Panel</h2>
      <div className="admin-links">
        <Link to="/admin/rooms">Manage Rooms</Link>
        <Link to="/admin/bookings">Manage Bookings</Link>
        <Link to="/admin/reviews">Manage Reviews</Link>
        <Link to="/admin/users">Manage Users</Link>
        <Link to="/admin/analysis">Hotel-Data Analytics</Link>
      </div>
    </div>
  );
}

export default Admin;
