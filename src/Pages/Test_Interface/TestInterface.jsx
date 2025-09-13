// src/components/TestInterface.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
// --- NEW: Import the blocker hook from React Router ---
import { unstable_useBlocker as useBlocker } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
  Stack,
  Image,
  Modal,
} from "react-bootstrap";
import "./TestInterface.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const TestInterface = ({ id, onBack }) => {
  // --- STATE MANAGEMENT ---
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);

  // --- NEW STATE for the navigation blocker modal ---
  const [showNavBlocker, setShowNavBlocker] = useState(false);

  // --- DATA FETCHING & SUBMISSION ---
  // ... (This section remains unchanged)
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const [questionsRes, testDetailsRes] = await Promise.all([
          axios.get(`${baseUrl}/api/tests/${id}/questions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/tests/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTestData({ ...testDetailsRes.data, questions: questionsRes.data });
        setTimeLeft(testDetailsRes.data.duration_minutes * 60);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Test not found."
            : "Failed to load the test."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      try {
        const token = localStorage.getItem("token");
        const formattedAnswers = Object.entries(answers).map(
          ([questionId, selectedOption]) => ({
            questionId: parseInt(questionId, 10),
            selectedOption,
          })
        );
        await axios.post(
          `${baseUrl}/api/tests/${id}/submit`,
          { answers: formattedAnswers, testId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!isAutoSubmit) {
          alert("Test submitted successfully!");
        }
        onBack();
      } catch (error) {
        if (!isAutoSubmit) {
          alert("There was an error submitting your test.");
        }
      }
    },
    [id, answers, onBack]
  );

  // --- TIMER LOGIC ---
  // ... (This section remains unchanged)
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      handleSubmit(true);
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, handleSubmit]);

  // --- SECURITY FEATURES ---

  // --- NEW: React Router Navigation Blocker ---
  const blocker = useBlocker(
    // Block navigation only when the test has loaded
    !!testData && !loading
  );

  // Show the modal when the blocker is triggered
  useEffect(() => {
    if (blocker && blocker.state === "blocked") {
      setShowNavBlocker(true);
    }
  }, [blocker]);

  const handleProceedNavigation = async () => {
    await handleSubmit(true); // Auto-submit the test
    if (blocker) {
      blocker.proceed(); // Allow navigation
    }
  };

  const handleCancelNavigation = () => {
    setShowNavBlocker(false);
    if (blocker) {
      blocker.reset(); // Cancel the navigation block
    }
  };

  // 1. Prevent Right-Click (Unchanged)
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // 2. Warn on Tab Switch (Unchanged)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setShowLeaveWarning(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 3. Warn on Page Close/Reload (Unchanged, still necessary)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your test will be submitted.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ... (All other handler functions and render logic remain the same)
  const handleAnswerChange = (questionId, optionKey) =>
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  const handleMarkReview = () => {
    /* ... */
  };
  const handleSaveAndNext = () => {
    /* ... */
  };
  const goToQuestion = (index) => {
    /* ... */
  };
  if (loading) {
    /* ... */
  }
  if (error) {
    /* ... */
  }
  if (!testData || !testData.questions || testData.questions.length === 0) {
    /* ... */
  }
  const { questions } = testData;
  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const getStatusVariant = (q, index) => {
    /* ... */
  };

  return (
    <>
      <Container
        as={motion.div}
        fluid
        className={`p-3 test-interface-container ${
          isPaletteOpen ? "sidebar-open" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* --- ALL YOUR EXISTING JSX FOR THE TEST INTERFACE GOES HERE --- */}
        {/* This part is unchanged */}
        {isPaletteOpen && (
          <div
            className="palette-overlay d-lg-none"
            onClick={() => setIsPaletteOpen(false)}
          />
        )}
        <Button
          variant="primary"
          className="d-lg-none palette-toggle-btn"
          onClick={() => setIsPaletteOpen(!isPaletteOpen)}
          aria-controls="question-palette"
          aria-expanded={isPaletteOpen}
        >
          <FaArrowRight />
        </Button>
        <Row className="g-3" style={{ height: "calc(100vh - 2rem)" }}>
          {/* All 3 Columns (Palette, Question, Timer) */}
        </Row>
      </Container>

      {/* Warning Modal for Tab Switching (Unchanged) */}
      <Modal
        show={showLeaveWarning}
        onHide={() => setShowLeaveWarning(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>⚠️ Warning: Test in Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have moved away from the test window. Switching tabs or leaving
          the page may result in automatic submission.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLeaveWarning(false)}
          >
            Resume Test
          </Button>
          <Button variant="danger" onClick={() => handleSubmit(true)}>
            Submit Now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- NEW: Modal for Browser Back Button Warning --- */}
      <Modal
        show={showNavBlocker}
        onHide={handleCancelNavigation}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>✋ Confirm Navigation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to leave? Your progress will be submitted
          automatically if you continue.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelNavigation}>
            Stay on Page
          </Button>
          <Button variant="danger" onClick={handleProceedNavigation}>
            Leave and Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestInterface;
