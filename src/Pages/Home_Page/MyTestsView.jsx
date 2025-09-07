import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { BookIcon, ArrowRightIcon } from "./Icons";
import "./MyTestView.css";
const baseUrl = import.meta.env.BASE_URL;

const MyTestsView = () => {
  const [boughtTests, setBoughtTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoughtTests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/user/mytests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // --- THIS IS THE CORRECTED LINE ---
        // It now handles both a single object and an array from the API
        setBoughtTests(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setBoughtTests([]); // Safely set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchBoughtTests();
  }, []);

  const goToShop = () => {
    navigate("/shop");
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <motion.div className="my-tests-view">
      <h1 className="view-title">My Tests</h1>
      {boughtTests.length > 0 ? (
        <motion.div className="tests-grid">
          {boughtTests.map((data) => (
            <motion.div key={data.id} className="test-card card">
              <div className="test-card-subject">
                <BookIcon />
                <span>{data.subject_topic}</span>
              </div>
              <h3 className="test-card-title">{data.test_name}</h3>
              <p className="test-card-info">{data.num_questions} Questions</p>
              <motion.button
                className="start-test-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/tests/${data.id}`)}
              >
                <span>Start Test</span>
                <ArrowRightIcon />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div className="empty-tests-container card">
          <h2>No Tests Here!</h2>
          <p>
            It looks like you haven't purchased any tests yet. Browse our
            library to find the perfect test to kickstart your preparation.
          </p>
          <motion.button
            className="browse-tests-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToShop}
          >
            Browse All Tests
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyTestsView;
