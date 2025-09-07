import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login_Page.css";
import axios from "axios";
const baseUrl = import.meta.env.BASE_URL;

const LoginPage = () => {
  const [email, setEmailOrPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Email/Phone and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/login`, {
        email,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Optionally store user info as well
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/home");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError(err.response.data.error || "Invalid email/phone or password");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form" noValidate>
          <h2 className="form-title">Welcome Back!</h2>
          <p className="form-subtitle">Sign in to continue to the platform.</p>
          <label htmlFor="emailOrPhone" className="form-label">
            Email or Phone
          </label>
          <div className="input-group">
            <input
              type="text"
              id="emailOrPhone"
              name="emailOrPhone"
              className="form-input"
              placeholder=" "
              value={email}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div className={`error-message ${error ? "show" : ""}`}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
