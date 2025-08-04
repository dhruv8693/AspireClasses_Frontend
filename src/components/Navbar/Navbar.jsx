import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { id: "legacy", title: "Why AMU?" },
    { id: "features", title: "Features" },
    { id: "pricing", title: "Pricing" },
    { id: "contact", title: "Contact" },
    { id: "register", title: "Register" },
  ];

  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    closed: { opacity: 0, x: "-100%" },
  };

  const linkVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: -20, opacity: 0 },
  };

  return (
    <motion.nav
      className={`navbar ${isSticky ? "sticky" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => scrollToSection("hero")}>
          Aspire Classes
        </div>
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
        </div>
        <motion.ul
          className={`navbar-menu ${isOpen ? "open" : ""}`}
          variants={menuVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
        >
          {navLinks.map((link) => (
            <motion.li
              key={link.id}
              className="nav-item"
              variants={linkVariants}
            >
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                className="nav-link"
              >
                {link.title}
              </a>
            </motion.li>
          ))}
        </motion.ul>
        <div className="navbar-desktop-menu">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.id);
              }}
              className="nav-link"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
