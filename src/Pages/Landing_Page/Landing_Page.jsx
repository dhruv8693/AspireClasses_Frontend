// src/landing_page.jsx

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  FaBookOpen,
  FaBullseye,
  FaChartLine,
  FaUsers,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import logo from "./logo.png";
import "./Landing_Page.css";
import { TfiAgenda } from "react-icons/tfi";

// Reusable animation variants
const sectionFadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardHover = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 300 },
};

// Helper component for animated sections
const AnimatedSection = ({ children, id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionFadeIn}
    >
      {children}
    </motion.section>
  );
};

// --- Component Definitions ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    "home",
    "why-us",
    "features",
    "exams",
    "pricing",
    "contact",
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <a href="/#home" className="nav-logo">
          <img src={logo} alt="PrepSphere Logo" />
        </a>

        {/* This wrapper helps group nav links and the button on desktop */}
        <div className="nav-menu">
          <nav className={`nav-links ${isOpen ? "active" : ""}`}>
            <ul>
              {navLinks.map((link) => (
                <li key={link}>
                  <a href={`/#${link}`} onClick={handleLinkClick}>
                    {link.replace("-", " ")}
                  </a>
                </li>
              ))}
              {/* 2. Add a Register link specifically for the mobile menu */}
              <li className="mobile-register-link">
                <Link to="/register" onClick={handleLinkClick}>
                  Register
                </Link>
              </li>
            </ul>
          </nav>

          {/* 3. Add the Register button for desktop view */}
          <Link to="/register" className="register-btn">
            Register Now
          </Link>
        </div>

        <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </header>
  );
};

const Hero = () => (
  <motion.section
    id="home"
    className="hero"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="hero-background"></div>
    <div className="container hero-content">
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Unlock Your Potential. Conquer Your Entrance Exam.
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        High-quality, affordable test series crafted by successful students to
        empower your journey to top schools.
      </motion.p>
      <motion.div
        className="hero-cta"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <a href="#pricing" className="cta-button primary">
          Start Your Test Series
        </a>
        <a href="#exams" className="cta-button secondary">
          Explore Exams
        </a>
      </motion.div>
    </div>
  </motion.section>
);

const WhyChooseUs = () => (
  <AnimatedSection id="why-us">
    <div className="container">
      <h2 className="section-title">Why Choose AspireClasses?</h2>
      <p className="section-subtitle">
        We focus on what truly matters for your success.
      </p>
      <div className="grid-3">
        <motion.div className="card" whileHover={cardHover}>
          <TfiAgenda className="card-icon" />
          <h3>Legacy of Excellence: AMU</h3>
          <p>
            Master the AMU 9th Entrance with test series designed around its
            prestigious and unique pattern, giving you a competitive edge.
          </p>
        </motion.div>
        <motion.div className="card" whileHover={cardHover}>
          <FaBookOpen className="card-icon" />
          <h3>Diverse Exam Coverage</h3>
          <p>
            Beyond AMU, we offer expertly crafted series for JMI, Sainik School,
            Navodaya, ensuring comprehensive preparation for all your goals.
          </p>
        </motion.div>
        <motion.div className="card" whileHover={cardHover}>
          <FaUsers className="card-icon" />
          <h3>Created by Achievers</h3>
          <p>
            Our content is developed by students who have successfully cleared
            these very exams, providing insights you won't find anywhere else.
          </p>
        </motion.div>
      </div>
      <CredibilitySection />
    </div>
  </AnimatedSection>
);

const CredibilitySection = () => (
  <div className="credibility-section">
    <h3 className="sub-section-title">From Those Who've Walked the Path</h3>
    <div className="testimonial-grid">
      <div className="testimonial-card">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="Student avatar 1"
          className="avatar"
        />
        <blockquote>
          "The mock tests were almost identical to the real exam. It made all
          the difference."
        </blockquote>
        <cite>- Aisha K., AMU Class IX</cite>
      </div>
      <div className="testimonial-card">
        <img
          src="https://i.pravatar.cc/100?img=5"
          alt="Student avatar 2"
          className="avatar"
        />
        <blockquote>
          "The analytics helped me pinpoint my weak areas. Invaluable for my JMI
          prep!"
        </blockquote>
        <cite>- Rohan S., JMI Aspirant</cite>
      </div>
    </div>
  </div>
);

const Features = () => (
  <AnimatedSection id="features">
    <div className="container">
      <h2 className="section-title">Features Built for Victory</h2>
      <div className="grid-4">
        <motion.div className="glass-card" whileHover={cardHover}>
          <FaBullseye className="card-icon" />
          <h3>Realistic Mock Tests</h3>
          <p>
            Simulate the actual exam environment to build confidence and time
            management skills.
          </p>
        </motion.div>
        <motion.div className="glass-card" whileHover={cardHover}>
          <FaBookOpen className="card-icon" />
          <h3>Previous Year Papers</h3>
          <p>
            Analyze trends and understand the exam pattern with a vast library
            of past papers.
          </p>
        </motion.div>
        <motion.div className="glass-card" whileHover={cardHover}>
          <FaChartLine className="card-icon" />
          <h3>Performance Analytics</h3>
          <p>
            Get detailed reports on your strengths and weaknesses to focus your
            efforts effectively.
          </p>
        </motion.div>
        <motion.div className="glass-card" whileHover={cardHover}>
          <FaUsers className="card-icon" />
          <h3>Expert Doubt Support</h3>
          <p>
            Clarify your doubts with our team of mentors who have aced these
            exams.
          </p>
        </motion.div>
      </div>
    </div>
  </AnimatedSection>
);

const ExamsOffered = () => (
  <AnimatedSection id="exams">
    <div className="container">
      <h2 className="section-title">Exams We Cover</h2>
      <div className="exams-grid">
        <div className="exam-card prominent">
          <h4>AMU 9th Entrance</h4>
        </div>

        <div className="exam-card">
          <h4>Navodaya (JNVST)</h4>
        </div>

        <div className="exam-card">
          <h4>coming soon</h4>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

const Pricing = () => (
  <AnimatedSection id="pricing">
    <div className="container">
      <h2 className="section-title">Simple & Affordable Access</h2>
      <div className="pricing-card">
        <h3>All-Access Pass</h3>
        <p className="price">
          ₹699 <span className="price-term">/ Full Access</span>
        </p>
        <ul>
          <li>✓ Access to All Test Series</li>
          <li>✓ Unlimited Mock Tests</li>
          <li>✓ Detailed Performance Analytics</li>
          <li>✓ Previous Year Question Papers</li>
          <li>✓ 24/7 Doubt Support via Chat</li>
        </ul>
        <a href="#contact" className="cta-button primary full-width">
          Get Started Now
        </a>
      </div>
    </div>
  </AnimatedSection>
);

const Contact = () => (
  <AnimatedSection id="contact">
    <div className="container text-center">
      <h2 className="section-title">Ready to Begin?</h2>
      <p className="section-subtitle">
        Reach out to us and take the first step towards your dream school.
      </p>
      <div className="contact-buttons">
        <a
          href="https://wa.me/910000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button secondary"
        >
          <FaWhatsapp /> Chat on WhatsApp
        </a>
        <a
          href="mailto:support@prepsphere.com"
          className="cta-button secondary"
        >
          <FaEnvelope /> Send an Email
        </a>
      </div>
    </div>
  </AnimatedSection>
);

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="social-links">
        <a href="#">
          <FaInstagram />
        </a>
        <a href="#">
          <FaFacebook />
        </a>
        <a href="#">
          <FaEnvelope />
        </a>
      </div>
      <p>
        &copy; {new Date().getFullYear()} AspireClasses. All Rights Reserved.
      </p>
    </div>
  </footer>
);

// --- Main Landing Page Component ---

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyChooseUs />
        <Features />
        <ExamsOffered />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
