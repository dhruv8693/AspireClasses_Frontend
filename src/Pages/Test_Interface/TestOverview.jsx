// src/components/TestOverview.jsx
import React from "react";
import { motion } from "framer-motion";
import "./TestOverview.css";

const TestOverview = ({ testData, onStartTest }) => {
  const { test_name, subject_topic, num_questions, duration_minutes } =
    testData;

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="overview-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <h1 className="overview-title">{test_name}</h1>
      <p className="overview-subject">{subject_topic}</p>

      <div className="overview-details">
        <div className="detail-item">
          <span>Questions</span>
          <strong>{num_questions}</strong>
        </div>
        <div className="detail-item">
          <span>Duration</span>
          <strong>{duration_minutes} mins</strong>
        </div>
      </div>

      <div className="overview-instructions">
        <h2>Instructions</h2>
        <ul>
          <li>Ensure you have a stable internet connection.</li>
          <li>Do not refresh the page during the test.</li>
          <li>The timer will start as soon as you click the button below.</li>
        </ul>
      </div>

      <button onClick={onStartTest} className="start-test-button">
        Start Test
      </button>
    </motion.div>
  );
};

export default TestOverview;
