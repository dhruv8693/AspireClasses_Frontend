// src/components/TestInterface.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa"; // Assuming you have react-icons installed
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
} from "react-bootstrap";
import "./TestInterface.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const TestInterface = ({ id, onBack }) => {
  // ... all your state and functions remain exactly the same ...
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

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

  const handleSubmit = useCallback(async () => {
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
      alert("Test submitted successfully!");
      onBack();
    } catch (error) {
      alert("There was an error submitting your test.");
    }
  }, [id, answers, onBack]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, handleSubmit]);

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

  if (loading)
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading Test...</p>
      </Container>
    );
  if (error)
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={onBack} variant="secondary">
          Go Back
        </Button>
      </Container>
    );
  if (!testData || !testData.questions || testData.questions.length === 0)
    return (
      <Alert variant="warning">No questions available for this test.</Alert>
    );

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
    <Container
      as={motion.div}
      fluid
      // --- MODIFIED LINE ---
      className={`p-3 test-interface-container ${
        isPaletteOpen ? "sidebar-open" : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ... The rest of your JSX remains exactly the same ... */}
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
        <Col
          lg={3}
          md={4}
          id="question-palette"
          className={`palette-sidebar ${isPaletteOpen ? "open" : ""}`}
        >
          <Card className="h-100 d-flex flex-column">
            <Card.Header
              as="h5"
              className="d-flex justify-content-between align-items-center"
            >
              <span>Question Palette</span>
              <Button
                variant="close"
                className="d-lg-none"
                onClick={() => setIsPaletteOpen(false)}
              />
            </Card.Header>
            <Card.Body className="flex-grow-1" style={{ overflowY: "auto" }}>
              <Row xs={4} sm={5} md={4} lg={5} className="g-2 text-center">
                {questions.map((q, index) => (
                  <Col key={q.id}>
                    <Button
                      variant={getStatusVariant(q, index)}
                      className={`w-100 rounded-circle ${
                        getStatusVariant(q, index) === "answered-review"
                          ? "answered-review"
                          : ""
                      }`}
                      active={currentQuestionIndex === index}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card.Body>
            <Card.Footer>
              <Stack gap={2} className="small">
                <div>
                  <span className="legend-box bg-success"></span> Answered
                </div>
                <div>
                  <span className="legend-box bg-warning"></span> Marked for
                  Review
                </div>
                <div>
                  <span className="legend-box answered-review-legend"></span>{" "}
                  Answered & Marked
                </div>
                <div>
                  <span className="legend-box border border-secondary"></span>{" "}
                  Not Visited
                </div>
              </Stack>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={6} md={8}>
          <Card className="h-100 d-flex flex-column">
            <Card.Header>
              <Card.Title as="h5">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Card.Title>
            </Card.Header>
            <Card.Body style={{ overflowY: "auto" }}>
              <p className="lead">{currentQuestion.question_text}</p>
              {currentQuestion.image_url && (
                <div className="text-center my-3">
                  <Image
                    src={currentQuestion.image_url}
                    fluid
                    rounded
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              )}
              <Form>
                <Stack gap={3}>
                  {Object.entries(currentQuestion.options).map(
                    ([key, value]) => (
                      <Form.Check
                        key={key}
                        type="radio"
                        id={`q${currentQuestion.id}-opt${key}`}
                        name={`question-${currentQuestion.id}`}
                        label={value}
                        value={key}
                        checked={answers[currentQuestion.id] === key}
                        onChange={() =>
                          handleAnswerChange(currentQuestion.id, key)
                        }
                      />
                    )
                  )}
                </Stack>
              </Form>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between">
                <Button variant="warning" onClick={handleMarkReview}>
                  {markedForReview.has(currentQuestion.id)
                    ? "Unmark Review"
                    : "Mark for Review"}
                </Button>
                <Button variant="success" onClick={handleSaveAndNext}>
                  Save & Next
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg={3} className="d-none d-lg-block">
          <Card className="h-100 d-flex flex-column text-center">
            <Card.Header as="h5">Time Left</Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center">
              <div className="display-4 fw-bold text-primary">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-grid">
                <Button variant="danger" size="lg" onClick={handleSubmit}>
                  Submit Test
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestInterface;
