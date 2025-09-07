import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateQuestions.css";
const baseUrl = process.env.BASE_URL;

const QuestionImageUploader = ({ currentImageUrl, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState(currentImageUrl);
  const fileInputId = React.useId();

  useEffect(() => {
    setPreview(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileChangeAndUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("questionImage", file);

    try {
      const response = await axios.post(
        `${baseUrl}/api/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );

      // This is the correct version, matching your backend controller
      onUploadComplete(response.data.image_url);
    } catch (err) {
      setUploadError("Image upload failed. Please try again.");
      console.error(err);
      setPreview(currentImageUrl);
    } finally {
      setIsUploading(false);
      // Not revoking URL here to keep preview on failed upload
    }
  };

  return (
    <div className="question-image-uploader">
      <div className="image-preview-box">
        {preview ? (
          <img src={preview} alt="Question Preview" className="image-preview" />
        ) : (
          <span className="no-image-text">No Image</span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChangeAndUpload}
        disabled={isUploading}
        id={fileInputId}
        className="image-upload-input"
      />
      <label htmlFor={fileInputId} className="image-upload-label-btn">
        {isUploading ? "Uploading..." : "Change Image"}
      </label>
      {uploadError && (
        <p className="message error-message-small">{uploadError}</p>
      )}
    </div>
  );
};

const AddQuestionForm = ({ testId, onQuestionAdded, onCancel }) => {
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    options: ["", "", "", ""],
  });
  const [correctAnswerLetter, setCorrectAnswerLetter] = useState("");
  const [questionImageUrl, setQuestionImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newQuestion.options.some((opt) => opt.trim() === "")) {
      setError("Please fill out all four option fields.");
      return;
    }
    if (!correctAnswerLetter) {
      setError("Please select the correct answer (A, B, C, or D).");
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");

      const payload = {
        question_text: newQuestion.question_text,
        options: newQuestion.options,
        correct_option: correctAnswerLetter,
        image_url: questionImageUrl,
      };

      const response = await axios.post(
        `${baseUrl}/api/tests/${testId}/questions`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // --- This is our previous fix (still necessary) ---
      const completeQuestion = {
        ...response.data.question, // Gets the new 'id' from the server
        ...payload, // Overwrites with your local data, ensuring image_url is present
      };

      onQuestionAdded(completeQuestion);
      // --- End fix ---

      alert("Question added successfully!");
      setQuestionImageUrl("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add the question.");
    }
  };

  return (
    <div className="add-question-form-container">
      <h3>Add a New Question</h3>
      {error && <p className="message error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="editing-view">
        <label>Question Text:</label>
        <textarea
          name="question_text"
          value={newQuestion.question_text}
          onChange={handleInputChange}
          required
        />
        <label>Question Image (Optional):</label>
        <QuestionImageUploader
          currentImageUrl={questionImageUrl}
          onUploadComplete={(image_url) => setQuestionImageUrl(image_url)}
        />
        <label>Options:</label>
        {newQuestion.options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${String.fromCharCode(65 + index)}`}
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
          />
        ))}
        <label>Correct Answer:</label>
        <select
          value={correctAnswerLetter}
          onChange={(e) => setCorrectAnswerLetter(e.target.value)}
          required
        >
          <option value="" disabled>
            Select correct option
          </option>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
          <option value="c">Option C</option>
          <option value="d">Option D</option>
        </select>
        <div className="card-actions">
          <button type="submit" className="save-btn">
            Add Question
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export const UpdateQuestions = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({});

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/tests`);
        setTests(response.data);
        if (response.data.length > 0) {
          setSelectedTest(response.data[0].id);
        }
      } catch (err) {
        setError("Failed to fetch tests.");
      }
    };
    fetchTests();
  }, []);

  const handleFetchQuestions = async () => {
    if (!selectedTest) return;
    setLoading(true);
    setError("");
    setIsAddingQuestion(false);
    setQuestions([]);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(
        `${baseUrl}/api/tests/${selectedTest}/questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const questionsWithParsedOptions = response.data.map((q) => ({
        ...q,
        options:
          typeof q.options === "string"
            ? JSON.parse(q.options)
            : q.options || [],
      }));
      setQuestions(questionsWithParsedOptions);
    } catch (err) {
      setError("Failed to fetch questions for the selected test.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`${baseUrl}/api/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(questions.filter((q) => q.id !== questionId));
      alert("Question deleted successfully!");
    } catch (err) {
      setError("Failed to delete question.");
    }
  };

  const handleEdit = (question) => {
    setEditingQuestionId(question.id);
    setEditedQuestion({
      ...question,
      options: Array.isArray(question.options) ? question.options : [],
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditedQuestion({});
  };

  const handleSave = async (questionId) => {
    try {
      const token = localStorage.getItem("admin_token");
      await axios.put(
        `${baseUrl}/api/questions/${questionId}`,
        editedQuestion,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the main list with the saved data
      setQuestions(
        questions.map((q) => (q.id === questionId ? editedQuestion : q))
      );
      window.alert("Question saved successfully!");
      handleCancelEdit();
    } catch (err) {
      setError("Failed to save changes.");
    }
  };

  // --- NEW HANDLER FUNCTION ---
  const handleRemoveImage = async (questionId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove the image from this question?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`${baseUrl}/api/questions/${questionId}/image`, {
        headers: { Authorization: `Bearer ${token}` },
        payload: { hi: "Hello" },
      });

      // Update the local "editedQuestion" state so the UI refreshes
      setEditedQuestion((prev) => ({
        ...prev,
        image_url: null,
      }));

      // Also update the main "questions" list in the background
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, image_url: null } : q
        )
      );

      alert("Image removed successfully.");
    } catch (err) {
      setError("Failed to remove image.");
      console.error(err);
    }
  };
  // --- END NEW HANDLER ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(editedQuestion.options || [])];
    newOptions[index] = value;
    setEditedQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const handleQuestionAdded = (newQuestion) => {
    const parsedQuestion = {
      ...newQuestion,
      options:
        typeof newQuestion.options === "string"
          ? JSON.parse(newQuestion.options)
          : newQuestion.options,
    };
    setQuestions((prevQuestions) => [...prevQuestions, parsedQuestion]);
    setIsAddingQuestion(false);
  };

  return (
    <div className="update-questions-container">
      <h2>Update Test Questions</h2>
      {error && <p className="message error-message">{error}</p>}
      <div className="test-selector-form">
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
        >
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.test_name}
            </option>
          ))}
        </select>
        <button onClick={handleFetchQuestions} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Questions"}
        </button>
      </div>

      <div className="add-question-section">
        {!isAddingQuestion && selectedTest && (
          <button
            className="add-new-btn"
            onClick={() => setIsAddingQuestion(true)}
          >
            + Add New Question
          </button>
        )}
        {isAddingQuestion && (
          <AddQuestionForm
            testId={selectedTest}
            onQuestionAdded={handleQuestionAdded}
            onCancel={() => setIsAddingQuestion(false)}
          />
        )}
      </div>

      <div className="questions-list">
        {questions.map((q) => (
          <div key={q.id} className="question-card">
            {editingQuestionId === q.id ? (
              <div className="editing-view">
                <label>Question Text:</label>
                <textarea
                  name="question_text"
                  value={editedQuestion.question_text || ""}
                  onChange={handleInputChange}
                />
                <label>Question Image:</label>
                <QuestionImageUploader
                  currentImageUrl={editedQuestion.image_url || ""}
                  onUploadComplete={(newUrl) => {
                    setEditedQuestion((prev) => ({
                      ...prev,
                      image_url: newUrl,
                    }));
                  }}
                />

                {/* --- NEWLY ADDED BUTTON --- */}
                {/* Only show this button if there is currently an image URL */}
                {editedQuestion.image_url && (
                  <button
                    type="button"
                    className="delete-btn" // Re-using your delete button style
                    onClick={() => handleRemoveImage(q.id)}
                    style={{ marginLeft: "10px", backgroundColor: "#aa2a2a" }}
                  >
                    Remove Image
                  </button>
                )}
                {/* --- END OF NEW BUTTON --- */}

                <label>Options:</label>
                {(editedQuestion.options || []).map((opt, index) => (
                  <input
                    key={index}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                ))}
                <label>Correct Answer (a, b, c, or d):</label>
                <input
                  type="text"
                  name="correct_option"
                  value={editedQuestion.correct_option || ""}
                  onChange={handleInputChange}
                />
                <div className="card-actions">
                  <button className="save-btn" onClick={() => handleSave(q.id)}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="display-view">
                <h4>{q.question_text}</h4>

                {q.image_url && (
                  <div className="question-image-container">
                    <img
                      src={q.image_url}
                      alt="Question visual"
                      className="question-image"
                    />
                  </div>
                )}

                <ul>
                  {(q.options || []).map((opt, index) => {
                    const correctLetter = String.fromCharCode(97 + index);
                    return (
                      <li
                        key={index}
                        className={
                          q.correct_option === correctLetter ? "correct" : ""
                        }
                      >
                        {opt}
                      </li>
                    );
                  })}
                </ul>
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => handleEdit(q)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(q.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
