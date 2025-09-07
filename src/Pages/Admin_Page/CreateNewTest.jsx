import React, { useState } from "react";
import axios from "axios";
import "./CreateNewTest.css";
const baseUrl = import.meta.env.BASE_URL;

const CreateNewTest = () => {
  const [formData, setFormData] = useState({
    test_name: "",
    num_questions: "",
    duration_minutes: "",
    subject_topic: "",
    instructions: "",
    test_category: "standard", // Default value
    date_scheduled: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation on the frontend
    if (
      !formData.test_name ||
      !formData.num_questions ||
      !formData.duration_minutes
    ) {
      setError("Test Name, Number of Questions, and Duration are required.");
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.post(`${baseUrl}/api/tests`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage(response.data.message);
      // Reset form after successful submission
      setFormData({
        test_name: "",
        num_questions: "",
        duration_minutes: "",
        subject_topic: "",
        instructions: "",
        test_category: "standard",
        date_scheduled: "",
      });
      setTimeout(() => setSuccessMessage(""), 4000); // Clear message after 4 seconds
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to create the test. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="create-test-container">
      <h2>Create a New Test</h2>

      {successMessage && (
        <p className="message success-message">{successMessage}</p>
      )}
      {error && <p className="message error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="create-test-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="test_name">Test Name*</label>
            <input
              type="text"
              id="test_name"
              name="test_name"
              value={formData.test_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="test_category">Test Category</label>
            <select
              id="test_category"
              name="test_category"
              value={formData.test_category}
              onChange={handleChange}
            >
              <option value="standard">Standard</option>
              <option value="upcoming">Upcoming</option>
              <option value="practice">Practice</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="num_questions">Number of Questions*</label>
            <input
              type="number"
              id="num_questions"
              name="num_questions"
              value={formData.num_questions}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration_minutes">Duration (in minutes)*</label>
            <input
              type="number"
              id="duration_minutes"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject_topic">Subject / Topics</label>
          <textarea
            id="subject_topic"
            name="subject_topic"
            value={formData.subject_topic}
            onChange={handleChange}
            placeholder="e.g., Ch-1 Rational Numbers, Ch-2 Linear Equations..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="e.g., All questions are compulsory."
          />
        </div>

        <div className="form-group">
          <label htmlFor="date_scheduled">Scheduled Date (Optional)</label>
          <input
            type="date"
            id="date_scheduled"
            name="date_scheduled"
            value={formData.date_scheduled}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Test
        </button>
      </form>
    </div>
  );
};

export default CreateNewTest;
