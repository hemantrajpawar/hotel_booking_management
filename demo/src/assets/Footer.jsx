import React from "react";
import "./Footer.css";
import {motion} from 'framer-motion';
function Footer() {
  return (
    <div className="footer-container">
      <img
        className="footer-logo"
        src="\public\logo-removebg-preview.png"
      ></img>
      <div className="footer-content">
        <motion.div className="links"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: false }}>
          <h2>Quick Links</h2>
          
          <ul>
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="/rooms">Rooms</a>
            </li>
            <li>
              <a href="/events">Events & conference</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </motion.div>
        <motion.div className="links" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: false }} >
          <h2>Our Properties</h2>
         
          <ul>
            <li>
              <a href="#">Luxury Suites</a>
            </li>
            <li>
              <a href="#">Ocean View</a>
            </li>
            <li>
              <a href="#">Mountain Retreats</a>
            </li>
            <li>
              <a href="#">Royal Villas</a>
            </li>
          </ul>
        </motion.div>

        <div className="links">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
        >
          <h2 className="text-lg font-semibold text-amber-400 mb-4">Contact Us</h2>
        
          <a className="text-gray-300">Vyankatesh Resort</a>
          <a className="text-gray-300">Pune</a>
          <a className="text-gray-300">Email: pawarhemant429@gmail.com</a>
          <a className="text-gray-300">Phone: +91 9689567041</a>
        </motion.div>
        </div>
      </div>
      <div className="social-media">
      <a href="https://www.instagram.com/hemantpawar_raj/" ><img src="/instagram.png" /></a>
      <a href="https://github.com/hemantrajpawar"><img src="/github.png"></img></a>
      <a href="https://www.linkedin.com/in/hemant-pawar-b410bb261/"><img src="/linkedin.png"/></a>
      </div>
      <div className="devatlas">
        <p>
        © 2025 DevAtlas . All rights reserved.
        </p>
        <div>
          <p>Made by Hemant Pawar At , </p>
          <img
           src="\Screenshot__1003_-removebg-preview-removebg-preview.png">
          </img>
        </div>
      </div>
    </div>
  );
}

export default Footer;

