import React from "react";
import { motion } from "framer-motion";
import "./TestInterface.css";

/**
 * TestOverview component: Displays test details and a start button.
 * @param {object} props - Component props.
 * @param {string} props.testName - The name of the test.
 * @param {string} props.subject - The subject of the test.
 * @param {number} props.questionCount - The total number of questions.
 * @param {number} props.duration - The duration of the test in minutes.
 * @param {function} props.onStartTest - Callback to start the test.
 */
const TestOverview = ({
  testName,
  subject,
  questionCount,
  duration,
  onStartTest,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5,
      },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="test-page-container">
      <motion.div
        className="overview-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.h1 className="overview-title" variants={itemVariants}>
          {testName}
        </motion.h1>
        <motion.p className="overview-subject" variants={itemVariants}>
          {subject}
        </motion.p>

        <motion.div className="overview-details" variants={itemVariants}>
          <div className="detail-item">
            <span>Questions</span>
            <strong>{questionCount}</strong>
          </div>
          <div className="detail-item">
            <span>Duration</span>
            <strong>{duration} mins</strong>
          </div>
        </motion.div>

        <motion.div className="overview-instructions" variants={itemVariants}>
          <h2>Instructions</h2>
          <ul>
            <li>Ensure you have a stable internet connection.</li>
            <li>Do not refresh the page during the test.</li>
            <li>The timer will start as soon as you click the button below.</li>
            <li>Your progress will be saved automatically.</li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <button onClick={onStartTest} className="start-test-button">
            Start Test
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TestOverview;
