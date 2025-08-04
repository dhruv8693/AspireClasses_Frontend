import React from "react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-about">
          <h3>AMU Prep</h3>
          <p>
            Your trusted partner for the AMU Class 9 Entrance Exam preparation.
            Built with passion by AMU students.
          </p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#hero">Home</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              F
            </a>
            <a href="#" aria-label="Twitter">
              T
            </a>
            <a href="#" aria-label="Instagram">
              I
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} AMU Prep. All Rights Reserved. Not an official
          AMU website.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
