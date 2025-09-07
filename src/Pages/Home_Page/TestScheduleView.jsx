import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ClockIcon, CalendarIcon } from "./Icons";
import "./TestScheduleView.css";
const baseUrl = import.meta.env.BASE_URL;

const TestScheduleView = () => {
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingTests = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/upcoming-tests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUpcomingTests(response.data);
      } catch (err) {
        setError("Failed to fetch the test schedule. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingTests();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div>
          <div className="spinner"></div>
          <p className="loading-text">Loading Schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <motion.div
      key="test-schedule"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="schedule-view-container"
    >
      <h1 className="view-title">Upcoming Test Schedule</h1>
      <div className="schedule-list">
        <AnimatePresence>
          {upcomingTests.length > 0 ? (
            upcomingTests.map((test) => (
              <motion.div
                key={test.id}
                className="schedule-item"
                variants={itemVariants}
                layout
              >
                <div className="schedule-header">
                  <h3>{test.test_name}</h3>
                  <div className="schedule-meta">
                    <span>
                      <CalendarIcon />{" "}
                      {new Date(test.date_scheduled).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </span>
                    <span>
                      <ClockIcon /> {test.duration_minutes} mins
                    </span>
                  </div>
                </div>
                <div className="schedule-details">
                  <h4>Syllabus:</h4>
                  <p>{test.subject_topic}</p>
                </div>
                <div className="schedule-footer">
                  <motion.button
                    className="start-test-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/userdetails")}
                  >
                    Join Test
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="no-tests-message"
            >
              <p>No upcoming tests have been scheduled.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TestScheduleView;
