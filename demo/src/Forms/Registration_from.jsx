import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registration_form.css";

function Registration_from() {
    const [formData, setFormData] = useState({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
      });
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleRegister = async (e) => {
        e.preventDefault();
        try {
          await axios.post("/api/auth/register", { ...formData, Role: "user" });
          console.log("registration done !!")
          navigate("/login");
        } catch (err) {
          alert("Registration failed.");
        }
      };
    
  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input name="firstname" placeholder="First Name" onChange={handleChange} required />
        <input name="middlename" placeholder="Middle Name" onChange={handleChange} required />
        <input name="lastname" placeholder="Last Name" onChange={handleChange} required />
        <input type="email" name="email" autoComplete="off" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" autoComplete="new-password" placeholder="Password" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Registration_from;
