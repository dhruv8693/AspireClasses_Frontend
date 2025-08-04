import React from "react";
import { motion } from "framer-motion";
import "./Legacy.css";

const Legacy = () => {
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
  };

  return (
    <section id="legacy" className="legacy-section">
      <div className="container">
        <h2>A Legacy of Academic Excellence</h2>
        <motion.div
          className="legacy-content"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div className="legacy-text" variants={cardVariants}>
            <p>
              Aligarh Muslim University (AMU) is more than just an institution;
              it's a symbol of rich heritage and a beacon of academic
              brilliance. For over a century, it has been a center for
              pioneering research, intellectual discourse, and holistic
              education, shaping leaders and visionaries across the globe.
            </p>
            <p>
              Choosing AMU means becoming part of a tradition that values
              knowledge, fosters critical thinking, and prepares you for a
              future of success and impact.
            </p>
          </motion.div>
          <motion.div className="legacy-image-wrapper" variants={cardVariants}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Strachey_Hall.jpg/1024px-Strachey_Hall.jpg"
              alt="AMU Campus - Strachey Hall"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/eeeeee/cccccc?text=AMU+Campus";
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Legacy;
