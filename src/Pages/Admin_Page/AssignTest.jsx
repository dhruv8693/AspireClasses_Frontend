// src/components/AdminPage.js
import React, { useState, useEffect } from "react";

import "./AssignTest.css"; // For styling
import axios from "axios";
const baseUrl = process.env.BASE_URL;

const AssignTest = () => {
  // Data lists
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);

  // Form state
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        // Fetch users and tests in parallel
        const [usersResponse, testsResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/user/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/tests`),
        ]);

        setUsers(usersResponse.data);
        setTests(testsResponse.data);

        // Pre-select the first item in dropdowns if available
        if (usersResponse.data.length > 0) {
          setSelectedUser(usersResponse.data[0].id);
        }
        if (testsResponse.data.length > 0) {
          setSelectedTest(testsResponse.data[0].id);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedTest) {
      setError("Please select a user and a test.");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token"); // <-- add this inside submit
      const response = await axios.post(
        `${baseUrl}/api/user/assigntest`,
        {
          userId: selectedUser,
          testId: selectedTest,
          isPaid: isPaid,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage(response.data.message || "Test assigned successfully!");
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred.";
      setError(message);
    }
  };

  if (loading) return <div className="loading">Loading Admin Dashboard...</div>;

  return (
    <div className="admin-container">
      <h2>Admin Panel: Assign Test to User</h2>
      <form onSubmit={handleSubmit} className="assign-form">
        {error && <p className="message error-message">{error}</p>}
        {successMessage && (
          <p className="message success-message">{successMessage}</p>
        )}

        <div className="form-group">
          <label htmlFor="user-select">Select User:</label>
          <select
            id="user-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name} ({user.email_or_phone})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="test-select">Select Test:</label>
          <select
            id="test-select"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            required
          >
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.test_name}
              </option>
            ))}
            +
          </select>
        </div>

        <div className="form-group">
          <label>Payment Status:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="isPaid"
                value="true"
                checked={isPaid === true}
                onChange={() => setIsPaid(true)}
              />
              Paid
            </label>
            <label>
              <input
                type="radio"
                name="isPaid"
                value="false"
                checked={isPaid === false}
                onChange={() => setIsPaid(false)}
              />
              Not Paid
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Assign Test
        </button>
      </form>
    </div>
  );
};

export default AssignTest;
