// src/components/TestInterface.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
// --- CORRECTED: Import the stable 'useBlocker' hook ---
import { useBlocker } from "react-router-dom";
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
  const [showNavBlocker, setShowNavBlocker] = useState(false);

  // --- DATA FETCHING & SUBMISSION ---
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

  // React Router Navigation Blocker
  const blocker = useBlocker(!!testData && !loading);

  useEffect(() => {
    if (blocker && blocker.state === "blocked") {
      setShowNavBlocker(true);
    }
  }, [blocker]);

  const handleProceedNavigation = async () => {
    await handleSubmit(true);
    if (blocker) {
      blocker.proceed();
    }
  };

  const handleCancelNavigation = () => {
    setShowNavBlocker(false);
    if (blocker) {
      blocker.reset();
    }
  };

  // // 1. Prevent Right-Click
  // useEffect(() => {
  //   const handleContextMenu = (e) => e.preventDefault();
  //   document.addEventListener("contextmenu", handleContextMenu);
  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);

  // 2. Warn on Tab Switch
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

  // 3. Warn on Page Close/Reload
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

  // --- All other handler functions and render logic ---
  const handleAnswerChange = (questionId, optionKey) =>
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  const handleMarkReview = () => {
    const questionId = testData.questions[currentQuestionIndex].id;
    const newMarked = new Set(markedForReview);
    newMarked.has(questionId)
      ? newMarked.delete(questionId)
      : newMarked.add(questionId);
    setMarkedForReview(newMarked);
  };
  const handleSaveAndNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    if (window.innerWidth < 992) {
      setIsPaletteOpen(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        {" "}
        <Spinner animation="border" variant="primary" />{" "}
        <p className="mt-3">Loading Test...</p>{" "}
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        {" "}
        <Alert variant="danger">{error}</Alert>{" "}
        <Button onClick={onBack} variant="secondary">
          {" "}
          Go Back{" "}
        </Button>{" "}
      </Container>
    );
  }
  if (!testData || !testData.questions || testData.questions.length === 0) {
    return (
      <Alert variant="warning">No questions available for this test.</Alert>
    );
  }

  const { questions } = testData;
  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const getStatusVariant = (q, index) => {
    const isAnswered = answers.hasOwnProperty(q.id);
    const isMarked = markedForReview.has(q.id);
    if (isAnswered && isMarked) return "answered-review";
    if (isMarked) return "warning";
    if (isAnswered) return "success";
    if (currentQuestionIndex === index) return "primary";
    return "outline-secondary";
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
          {/* All 3 Columns (Palette, Question, Timer) would be here */}
        </Row>
      </Container>

      {/* Warning Modal for Tab Switching */}
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

      {/* Modal for Browser Back Button Warning */}
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
