import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register_Page.css";
const baseUrl = import.meta.env.BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false); // NEW: for popup visibility

  const { fullName, email, school } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let errors = {};

    if (!/^[A-Za-z\s]{3,}$/.test(fullName.trim())) {
      errors.fullName =
        "Full Name must be at least 3 letters (no numbers/symbols).";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    if (!emailPattern.test(email.trim()) && !phonePattern.test(email.trim())) {
      errors.email = "Enter a valid email or 10-digit phone number.";
    }

    if (school.trim().length < 3) {
      errors.school = "School Name must be at least 3 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    const newUser = { fullName, email, school };

    try {
      const API_URL = `${baseUrl}/api/register`;
      const response = await axios.post(API_URL, newUser);
      console.log("Registration successful:", response.data);

      // Show success popup
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      console.error("Registration error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h1 className="form-title">Create Account</h1>
          <p className="form-subtitle">Join our community to get started.</p>

          {error && <p className="form-error">{error}</p>}

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Arjun Sharma"
              required
            />
            {fieldErrors.fullName && (
              <p className="form-error">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email / Phone */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email or Phone
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="form-input"
              placeholder="you@example.com or 9876543210"
              required
            />
            {fieldErrors.email && (
              <p className="form-error">{fieldErrors.email}</p>
            )}
          </div>

          {/* School */}
          <div className="form-group">
            <label htmlFor="school" className="form-label">
              School
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={school}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Aligarh Muslim University"
              required
            />
            {fieldErrors.school && (
              <p className="form-error">{fieldErrors.school}</p>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="form-footer">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="success-popup-overlay">
          <div className="success-popup-card">
            <h2>🎉 Registration Successful!</h2>
            <p>You will be redirected to login page shortly...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
