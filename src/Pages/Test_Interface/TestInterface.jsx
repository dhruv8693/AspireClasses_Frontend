import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./TestInterface.css"; // Your modern CSS file

const TestInterface = ({ id, duration, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // duration in seconds
  const [markedForReview, setMarkedForReview] = useState(new Set());

  // Memoize the submit function to prevent re-creation on every render
  const handleSubmit = useCallback(async () => {
    if (document.body.classList.contains("submitting")) return;
    document.body.classList.add("submitting");

    try {
      const token = localStorage.getItem("token");

      // Convert answers object into array format
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOption]) => ({
          questionId: parseInt(questionId),
          selectedOption,
        })
      );

      await axios.post(
        `http://localhost:5000/api/tests/${id}/submit`,
        { testId: id, answers: formattedAnswers },
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

  // Effect for fetching questions once
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:5000/api/tests/${id}/questions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const questionArray = Array.isArray(data) ? data : data.questions || [];
        setQuestions(questionArray);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  // Effect for the countdown timer
  useEffect(() => {
    if (loading || !duration) return; // Don't start if loading or no duration

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          alert("Time's up! Your test will be submitted automatically.");
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [loading, duration, handleSubmit]);

  const handleAnswerChange = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleMarkReview = () => {
    const questionId = questions[currentQuestionIndex].id;
    const newMarked = new Set(markedForReview);
    if (newMarked.has(questionId)) {
      newMarked.delete(questionId);
    } else {
      newMarked.add(questionId);
    }
    setMarkedForReview(newMarked);
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Loading and error states
  if (loading) {
    return <div className="test-page-container">Loading Test...</div>;
  }

  if (questions.length === 0) {
    return <div className="test-page-container">No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Format time for display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="test-interface-container">
      {/* Left Panel: Question Palette */}
      <div className="panel left-panel">
        <h4>Question Palette</h4>
        <div className="question-grid">
          {questions.map((q, index) => {
            const isAnswered = answers.hasOwnProperty(q.id);
            const isMarked = markedForReview.has(q.id);
            let statusClass = "status-not-visited"; // Default status
            if (isAnswered) statusClass = "status-answered";
            if (isMarked) statusClass = "status-review";

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
      </div>

      {/* Center Panel: Question Display */}
      <div className="panel center-panel">
        <div className="question-header">
          <h4>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h4>
        </div>
        <p className="question-text">{currentQuestion.question_text}</p>
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
      </div>

      {/* Right Panel: Timer & Controls */}
      <div className="panel right-panel">
        <div className="timer-box">
          <span>Time Left</span>
          <div className="timer-display">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>
        <div className="controls">
          <button onClick={handleMarkReview} className="control-btn review-btn">
            Mark for Review
          </button>
          <button onClick={handleSaveAndNext} className="control-btn save-btn">
            Save & Next
          </button>
        </div>
        <div className="legend">
          <h4>Legend</h4>
          <div className="legend-item">
            <span
              className="status-box"
              style={{ backgroundColor: "var(--answered-color)" }}
            ></span>{" "}
            Answered
          </div>
          <div className="legend-item">
            <span
              className="status-box"
              style={{ backgroundColor: "var(--review-color)" }}
            ></span>{" "}
            Marked for Review
          </div>
          <div className="legend-item">
            <span
              className="status-box"
              style={{ border: "1px solid var(--not-visited-color)" }}
            ></span>{" "}
            Not Visited
          </div>
        </div>
        <button onClick={handleSubmit} className="control-btn submit-btn">
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default TestInterface;
