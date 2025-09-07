// src/components/TestPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import TestOverview from "./TestOverview";
import TestInterface from "./TestInterface";
import { AnimatePresence } from "framer-motion";
import "./TestPage.css";
const baseUrl = process.env.BASE_URL;

const TestPage = () => {
  // State for the list of all tests
  const [tests, setTests] = useState([]);
  // State for the single, specific test being viewed
  const [selectedTest, setSelectedTest] = useState(null);
  // NEW state to track if the user has clicked "Start Test"
  const [isTestStarted, setIsTestStarted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Effect to fetch data based on whether an ID is in the URL
  useEffect(() => {
    const fetchAllTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${baseUrl}/api/tests`);
        setTests(res.data || []);
      } catch (err) {
        setError("Failed to load tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSingleTest = async () => {
      try {
        setLoading(true);
        setError(null);
        // Always show the overview first when a new test ID is loaded
        setIsTestStarted(false);
        const res = await axios.get(`${baseUrl}/api/tests/${id}`);
        setSelectedTest(res.data);
      } catch (err) {
        setError("Could not find the requested test.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSingleTest();
    } else {
      fetchAllTests();
    }
  }, [id]); // This effect re-runs whenever the URL's id parameter changes

  // 1. Loading and Error states are handled first
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // 2. Logic for when an ID is present in the URL
  if (id && selectedTest) {
    return (
      <AnimatePresence mode="wait">
        {isTestStarted ? (
          // If test is started, show the interface
          <TestInterface
            key={`interface-${id}`}
            id={id}
            // onBack now just switches the state, not the URL
            onBack={() => setIsTestStarted(false)}
          />
        ) : (
          // If test is not started, show the overview
          <TestOverview
            key={`overview-${id}`}
            testData={selectedTest}
            // onStartTest now just switches the state
            onStartTest={() => setIsTestStarted(true)}
          />
        )}
      </AnimatePresence>
    );
  }

  // 3. Fallback: Render the list of all tests if no ID is in the URL
  return (
    <div className="test-page-container">
      <h2 className="page-title">Available Tests</h2>
      <AnimatePresence>
        <div className="test-list">
          {tests.length === 0 ? (
            <p>No tests available</p>
          ) : (
            tests.map((test) => (
              <TestOverview
                key={test.id}
                testData={test}
                onStartTest={() => navigate(`/tests/${test.id}`)}
              />
            ))
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default TestPage;
