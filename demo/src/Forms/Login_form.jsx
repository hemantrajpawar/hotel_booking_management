import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login_form.css";

function Login_form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
      alert("Login successful!!");
    } catch (err) {
      alert("Invalid credentials. Please fill fields properly");
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-title">Login</h2>

      {/* Dummy hidden form to trap Chrome autofill */}
      <form style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <input type="text" name="fakeuser" autoComplete="username" />
        <input type="password" name="fakepass" autoComplete="current-password" />
      </form>

      <form onSubmit={handleLogin} className="login-form" autoComplete="off">
        <input
          type="text"
          name="user_identifier" // avoid 'email' keyword
          className="login-input"
          placeholder="Email"
          autoComplete="off"
          readOnly
          onFocus={(e) => e.target.removeAttribute("readOnly")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          name="access_key" // avoid 'password' keyword
          className="login-input"
          placeholder="Password"
          autoComplete="new-password"
          readOnly
          onFocus={(e) => e.target.removeAttribute("readOnly")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login_form;
