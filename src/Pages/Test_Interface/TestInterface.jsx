// src/components/TestInterface.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./TestInterface.css";
const baseUrl = import.meta.env.VITE_BASE_URL;

const TestInterface = ({ id, onBack }) => {
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [markedForReview, setMarkedForReview] = useState(new Set());

  // Fetch all test data using two separate API calls
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");

        // Use Promise.all to fetch questions and test details concurrently
        const [questionsRes, testDetailsRes] = await Promise.all([
          axios.get(`${baseUrl}/api/tests/${id}/questions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/tests/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // --- CORRECTED STATE UPDATES ---
        // 1. Extract the actual data from the responses
        const questions = questionsRes.data;
        const testDetails = testDetailsRes.data;

        // 2. Combine the data into the structure the component expects
        setTestData({
          ...testDetails, // Contains id, test_name, etc.
          questions: questions, // Add the questions array to the object
        });

        // 3. Set the timer in SECONDS
        setTimeLeft(testDetails.duration_minutes * 60);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Test not found."
            : "Failed to load the test."
        );
        console.error("Error fetching test data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleSubmit = useCallback(async () => {
    // This function is correct and needs no changes.
    if (document.body.classList.contains("submitting")) return;
    document.body.classList.add("submitting");

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
      alert("Test submitted successfully! 🎉");
      onBack();
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("There was an error submitting your test.");
    } finally {
      document.body.classList.remove("submitting");
    }
  }, [id, answers, onBack]);

  // Countdown timer effect - this is correct and needs no changes.
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      alert("Time's up! Submitting your test automatically.");
      handleSubmit();
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, handleSubmit]);

  // All handler functions below are correct and need no changes.
  const handleAnswerChange = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleMarkReview = () => {
    const questionId = testData.questions[currentQuestionIndex].id;
    const newMarked = new Set(markedForReview);
    if (newMarked.has(questionId)) {
      newMarked.delete(questionId);
    } else {
      newMarked.add(questionId);
    }
    setMarkedForReview(newMarked);
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < testData.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // --- Render Logic ---

  if (loading) return <div className="status-container">Loading Test...</div>;

  if (error)
    return (
      <div className="status-container error-message">
        {error} <button onClick={onBack}>Go Back</button>
      </div>
    );

  // This guard is now more robust.
  if (!testData || !testData.questions || testData.questions.length === 0) {
    return (
      <div className="status-container">
        No questions available for this test.
      </div>
    );
  }

  // This destructuring now works perfectly.
  const { questions } = testData;
  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      className="test-interface-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* The entire JSX block is correct and needs no changes. */}
      {/* It correctly reads from the well-structured 'testData' object. */}
      <div className="panel left-panel">
        <h4>Question Palette</h4>
        <div className="question-grid">
          {questions.map((q, index) => {
            const isAnswered = answers.hasOwnProperty(q.id);
            const isMarked = markedForReview.has(q.id);
            let statusClass = "not-visited";
            if (isAnswered && !isMarked) statusClass = "answered";
            if (isMarked) statusClass = "review";
            if (isAnswered && isMarked) statusClass = "answered-review";
            return (
              <button
                key={q.id}
                className={`grid-item ${statusClass} ${
                  currentQuestionIndex === index ? "active" : ""
                }`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="legend">
          <h4>Legend</h4>
          <div className="legend-item">
            <span className="status-box answered"></span>Answered
          </div>
          <div className="legend-item">
            <span className="status-box review"></span>Marked for Review
          </div>
          <div className="legend-item">
            <span className="status-box not-visited"></span>Not Visited
          </div>
        </div>
      </div>
      <div className="panel center-panel">
        <div className="question-header">
          <h4>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h4>
        </div>
        <p className="question-text">{currentQuestion.question_text}</p>
        {currentQuestion.image_url && (
          <div className="question-image-container">
            <img
              src={currentQuestion.image_url}
              alt="Question illustration"
              className="question-image"
            />
          </div>
        )}
        <div className="options-list">
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <label key={key} className="option-label">
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={key}
                checked={answers[currentQuestion.id] === key}
                onChange={() => handleAnswerChange(currentQuestion.id, key)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
        <div className="navigation-controls">
          <button onClick={handleMarkReview} className="control-btn review-btn">
            {markedForReview.has(currentQuestion.id)
              ? "Unmark Review"
              : "Mark for Review"}
          </button>
          <button onClick={handleSaveAndNext} className="control-btn save-btn">
            Save & Next
          </button>
        </div>
      </div>
      <div className="panel right-panel">
        <div className="timer-box">
          <span>Time Left</span>
          <div className="timer-display">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>
        <button onClick={handleSubmit} className="control-btn submit-btn">
          Submit Test
        </button>
      </div>
    </motion.div>
  );
};

export default TestInterface;
