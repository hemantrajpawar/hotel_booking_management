import React from "react";
import "./Header.css";
import { useState ,useEffect} from "react";
import { Link } from "react-router-dom";


function Header() {

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let deferredPrompt;
    const installBtn = document.getElementById("installBtn");

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) installBtn.style.display = "block";

      installBtn.addEventListener("click", () => {
        installBtn.style.display = "none";
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
          if (choice.outcome === "accepted") {
            console.log("✅ App installed");
          }
          deferredPrompt = null;
        });
      });
    });
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Event & Conference", path: "/events" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name :"Register" , path: "/register" },
    { name:"Login" , path: "/login"},
    { name:"ChatBot" , path: "/chatbot"}
  ];

  const dropdownItems = [
    { name: "Admin", path: "/admin" },
    { name: "My Booking", path: "/my-bookings" },
    { name: "User Profile", path: "/user_profile" },
    { name: "Wishlist", path: "/wishlist" },
  ];


  return (
    <div className="navbar">
      <img src="/logo-removebg-preview.png" alt="Logo" />

      <button id="installBtn" title="Use to run in offline mode" style={{ display: "none" , backgroundColor:"black" , color:"white" }}>
      Install App
    </button>

      <nav>
        {navItems.map((item, index) => (
          <a key={index} href={item.path}>
            {item.name}
          </a>
        ))}
      </nav>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      
      {menuOpen && (
        <div className="dropdown">
          {dropdownItems.map((item, idx) => (
            <Link key={idx} to={item.path} onClick={() => setMenuOpen(false)}>
              {item.name}
            </Link>
          ))}
        </div>
      )}


    </div>
  );
}

export default Header;
