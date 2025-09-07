import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./DashboardView.css";
const baseUrl = import.meta.env.VITE_BASE_URL;

// Sample Data
const demoTests = [
  {
    id: 1,
    title: "AMU 9th Entrance",
    subject: "Mathematics",
    questions: 25,
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "JEE Mains Mock",
    subject: "Physics",
    questions: 30,
    difficulty: "Hard",
  },
  {
    id: 3,
    title: "NEET Biology Basics",
    subject: "Biology",
    questions: 50,
    difficulty: "Easy",
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      type: "spring",
      stiffness: 100,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const DashboardView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/results`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setResults(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const recentResults = results.slice(0, 5);

  return (
    <motion.div
      key="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="dashboard-container"
    >
      <h1 className="view-title">Dashboard</h1>
      <div className="dashboard-grid">
        <motion.section
          className="dashboard-section card"
          variants={itemVariants}
        >
          <div className="section-header">
            <h2>Recent Results</h2>
          </div>
          <div className="summary-table-container">
            {loading && <p>Loading results...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            {!loading && !error && recentResults.length > 0 ? (
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResults.map((result) => (
                    <tr key={result.id}>
                      <td>{result.test_name}</td>
                      <td>{parseInt((result.score / 85) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !loading && <p>No recent results found.</p>
            )}
          </div>
        </motion.section>

        <motion.section className="dashboard-section" variants={itemVariants}>
          <h2>Free Demo Tests</h2>
          <div className="test-grids">
            {demoTests.map((test) => (
              <motion.div
                key={test.id}
                className="test-card cards"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <h3>{test.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default DashboardView;
