// src/components/TestPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Container, Spinner, Alert, Stack } from "react-bootstrap";
import TestOverview from "./TestOverview"; // Assumes this is the refactored version
import TestInterface from "./TestInterface"; // Assumes this is the refactored version

const baseUrl = import.meta.env.VITE_BASE_URL;

const TestPage = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Data fetching logic remains the same ---
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
        setIsTestStarted(false); // Always show overview first
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
  }, [id]);

  // 1. Loading and Error states with Bootstrap components
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  // 2. Logic for a single test (ID in URL)
  if (id && selectedTest) {
    return (
      <AnimatePresence mode="wait">
        {isTestStarted ? (
          <TestInterface
            key={`interface-${id}`}
            id={id}
            onBack={() => setIsTestStarted(false)}
          />
        ) : (
          <Container className="py-3 py-md-5" style={{ maxWidth: "900px" }}>
            <TestOverview
              key={`overview-${id}`}
              testData={selectedTest}
              onStartTest={() => setIsTestStarted(true)}
            />
          </Container>
        )}
      </AnimatePresence>
    );
  }

  // 3. Fallback: Render the list of all tests
  return (
    <Container className="py-3 py-md-5" style={{ maxWidth: "900px" }}>
      <h1 className="display-5 text-center mb-4">Available Tests</h1>
      <AnimatePresence>
        {tests.length === 0 ? (
          <Alert variant="info" className="text-center">
            No tests are available at the moment.
          </Alert>
        ) : (
          <Stack gap={4}>
            {tests.map((test) => (
              <TestOverview
                key={test.id}
                testData={test}
                onStartTest={() => navigate(`/tests/${test.id}`)}
              />
            ))}
          </Stack>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default TestPage;
