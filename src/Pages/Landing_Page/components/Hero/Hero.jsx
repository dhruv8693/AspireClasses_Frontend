import React from "react";
import { motion } from "framer-motion";
import img from "./amu-logo.png";
import "./Hero.css";

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={img}
            alt="AMU Logo"
            className="amu-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/150x150/003366/FFFFFF?text=AMU";
            }}
          />
          <h1 className="hero-title">
            AMU Class 9 Entrance: Your Path to Excellence
          </h1>
          <p className="hero-subtitle">
            Master the exam with a test series crafted by those who have walked
            the path – current AMU students.
          </p>
          <motion.button
            className="hero-cta"
            onClick={scrollToContact}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 5px 20px rgba(0, 51, 102, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
