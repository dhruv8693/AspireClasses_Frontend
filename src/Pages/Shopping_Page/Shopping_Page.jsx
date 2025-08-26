import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Assume axiosInstance is pre-configured, e.g., in /src/api/axiosInstance.js
// import axiosInstance from '../api/axiosInstance';
import "./Shopping_Page.css";
import { useNavigate } from "react-router-dom";

// --- Mock Data (for demonstration) ---
// In a real app, this data would come from the API call.
const mockTestSeries = [
  {
    id: 1,
    name: "JEE Advanced 2025 Test Series",
    price: 499,
    subject: "Physics, Chemistry, Mathematics",
    short_description:
      "Comprehensive tests for JEE Advanced preparation designed by top educators to simulate the real exam environment and pinpoint your weaknesses.",
    full_description:
      "This series includes 20 full-length mock tests meticulously crafted to cover the entire JEE Advanced syllabus. Each test comes with detailed performance analysis, percentile scores, and video solutions for every question. Get the competitive edge you need to succeed.",
    num_tests: 20,
    test_duration: "3 hours",
  },
  {
    id: 2,
    name: "NEET UG 2025 Full Syllabus Pack",
    price: 449,
    subject: "Biology, Physics, Chemistry",
    short_description:
      "Master the NEET syllabus with our extensive test series. Includes chapter-wise tests, unit tests, and full-length mock exams.",
    full_description:
      "Prepare for NEET UG with 50+ tests designed to mirror the latest exam pattern. This pack offers a structured approach, starting with foundational chapter tests and progressing to full-scale simulations. Detailed reports will help you track your progress and improve your time management skills.",
    num_tests: 50,
    test_duration: "3 hours 20 minutes",
  },
  {
    id: 3,
    name: "UPSC Prelims 2025 GS + CSAT",
    price: 999,
    subject: "General Studies & CSAT",
    short_description:
      "A complete test series for the UPSC Civil Services Preliminary exam, covering both General Studies Paper 1 and CSAT Paper 2.",
    full_description:
      "Our flagship UPSC Prelims series features 35 high-quality tests, including sectional and full-length mocks. Questions are framed based on current trends and the official syllabus. Each test is followed by a comprehensive review session and detailed answer explanations from our expert faculty.",
    num_tests: 35,
    test_duration: "2 hours",
  },
  {
    id: 4,
    name: "CAT 2025 Sprint Series",
    price: 799,
    subject: "VARC, DILR, Quant",
    short_description:
      "An intensive test series for CAT aspirants aiming for a 99+ percentile. Focuses on advanced problem-solving techniques.",
    full_description:
      "This intensive sprint series contains 15 full-length CAT mocks and 30 sectional tests focusing on all three sections: Verbal Ability & Reading Comprehension (VARC), Data Interpretation & Logical Reasoning (DILR), and Quantitative Aptitude. It is designed to challenge you and perfect your exam strategy.",
    num_tests: 45,
    test_duration: "2 hours",
  },
];

// Helper to truncate text
const truncate = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const ShoppingPage = () => {
  const navigate = useNavigate();
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        // --- Real API Call (commented out for demo) ---
        // const response = await axiosInstance.get('/api/test-series');
        // setTestSeries(response.data);

        // --- Using Mock Data ---
        setTestSeries(mockTestSeries);
      } catch (err) {
        setError("Failed to fetch test series. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestSeries();
  }, []);

  if (loading) return <div className="loading-state">Loading courses...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="shopping-page-container">
      <h1>Available Test Series</h1>
      <div className="test-series-grid">
        {testSeries.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-container-${item.id}`}
            onClick={() =>
              setSelectedId(selectedId === item.id ? null : item.id)
            }
            className="test-series-card"
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="card-content-wrapper">
              <motion.h2 layoutId={`card-title-${item.id}`}>
                {item.name}
              </motion.h2>
              <motion.p className="subject-tag">{item.subject}</motion.p>
              <motion.p
                className="short-desc"
                layoutId={`card-desc-${item.id}`}
              >
                {truncate(item.short_description, 100)}
              </motion.p>
              <motion.div className="price" layoutId={`card-price-${item.id}`}>
                {item.price ? `₹${item.price}` : "Free"}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="expanded-view-backdrop"
            onClick={() => setSelectedId(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="test-series-card expanded"
              layoutId={`card-container-${selectedId}`}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {(() => {
                const item = testSeries.find((ts) => ts.id === selectedId);
                if (!item) return null;

                return (
                  <motion.div className="card-content-wrapper">
                    <motion.h2 layoutId={`card-title-${item.id}`}>
                      {item.name}
                    </motion.h2>
                    <motion.div
                      className="expanded-content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.2, duration: 0.4 },
                      }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="full-desc">{item.full_description}</p>
                      <div className="test-details">
                        <span>
                          <strong>Tests Included:</strong> {item.num_tests}
                        </span>
                        <span>
                          <strong>Duration:</strong> {item.test_duration} per
                          test
                        </span>
                      </div>
                      <p className="subject-tag expanded-tag">{item.subject}</p>
                      <div className="buy-section">
                        <motion.div
                          className="price"
                          layoutId={`card-price-${item.id}`}
                        >
                          {item.price ? `₹${item.price}` : "Free"}
                        </motion.div>
                        <button
                          className="buy-now-btn"
                          onClick={navigate("/UserDetails")}
                        >
                          Buy Now
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShoppingPage;
