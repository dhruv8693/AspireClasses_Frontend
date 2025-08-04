import React from "react";
import { motion } from "framer-motion";
import "./Features.css";

const featuresData = [
  {
    title: "Realistic Mock Tests",
    description:
      "Experience the real exam environment with full-length mock tests designed as per the latest AMU syllabus and pattern.",
    icon: "📝",
  },
  {
    title: "Previous Year Papers",
    description:
      "Analyze trends and understand the question style by solving a comprehensive collection of past exam papers.",
    icon: "⏳",
  },
  {
    title: "Timed Test Sessions",
    description:
      "Improve your speed and accuracy. Take tests under timed conditions to master time management skills.",
    icon: "⏱️",
  },
  {
    title: "Detailed Analytics",
    description:
      "Get in-depth performance reports after every test to identify your strengths and weaknesses.",
    icon: "📊",
  },
];

const Features = () => {
  const cardVariants = {
    offscreen: { scale: 0.8, opacity: 0 },
    onscreen: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <section id="features" className="features-section">
      <div className="container">
        <h2>Features of the Test Series</h2>
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
