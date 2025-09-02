import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EmailIcon, WhatsAppIcon } from "./Icons";
import "./AskdoubtView.css";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AskADoubtView = () => {
  const [username, setUserName] = useState("");

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name);
    }
  }, []);

  const contactEmail = "support@yourplatform.com";
  const contactPhone = "911234567890";
  const emailSubject = `Doubt from ${username || "a user"}`;

  return (
    <motion.div
      key="ask-doubt-contact"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="view-title">Have a Question?</h1>
      <motion.div className="contact-doubt-card card" variants={itemVariants}>
        <p className="contact-description">
          For immediate assistance or to get your doubts cleared by our experts,
          please reach out to us directly using one of the options below.
        </p>
        <div className="contact-buttons">
          <motion.a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent(
              emailSubject
            )}`}
            className="contact-button email"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <EmailIcon />
            <span>Contact via Email</span>
          </motion.a>
          <motion.a
            href={`https://wa.me/${contactPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button whatsapp"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <WhatsAppIcon />
            <span>Chat on WhatsApp</span>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AskADoubtView;
