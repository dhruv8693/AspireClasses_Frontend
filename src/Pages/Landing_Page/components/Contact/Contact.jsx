import React from "react";
import { motion } from "framer-motion";
import "./Contact.css";

const Contact = () => {
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Thank you for your message! We will get back to you soon.");
    e.target.reset();
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>Get in Touch</h2>
        <p className="contact-intro">
          Have questions? Fill out the form below, and our team will get back to
          you shortly.
        </p>
        <motion.form
          className="contact-form"
          variants={formVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your Name"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Your Email"
            />
          </div>
          <div className="form-group">
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder="Your Message"
            ></textarea>
          </div>
          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{
              scale: 1.05,
              backgroundColor: "var(--secondary-color)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
