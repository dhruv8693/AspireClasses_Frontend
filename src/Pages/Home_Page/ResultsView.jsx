import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ResultsView.css";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
const baseUrl = import.meta.env.VITE_BASE_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

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

  const comparisonChartData = {
    labels: [selectedResult?.test_name],
    datasets: [
      {
        label: "Your Score",
        data: [selectedResult?.score],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
      },
      {
        label: "Highest Score",
        data: [selectedResult?.highest_score],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
      },
    ],
  };

  const comparisonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Score Analysis for ${selectedResult?.test_name}`,
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Score (%)" },
      },
    },
  };

  if (loading) return <p>Loading your results...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <motion.div
      key="results"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="results-container"
    >
      <h1 className="view-title">All Results</h1>
      <motion.div
        className="results-table-container card"
        variants={itemVariants}
      >
        <table className="results-table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Your Score</th>
              <th>Highest Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <motion.tr
                key={result.id}
                onClick={() => setSelectedResult(result)}
                whileHover={{
                  backgroundColor: "rgba(243, 244, 246, 1)",
                  cursor: "pointer",
                }}
                title="Click to see analysis"
              >
                <td>{result.test_name}</td>
                <td>{result.score}%</td>
                <td>{result.highest_score}%</td>
                <td></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {selectedResult && (
          <motion.div
            className="modal-backdrop"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              className="analysis-modal card"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Result Analysis</h3>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="close-btn"
                >
                  &times;
                </button>
              </div>
              <div className="analysis-chart-container">
                <Bar
                  options={comparisonChartOptions}
                  data={comparisonChartData}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultsView;
