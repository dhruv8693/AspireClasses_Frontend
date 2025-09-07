import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios"; // Assuming you have a configured axios instance
import "./User_Detail.css";
const baseUrl = import.meta.env.VITE_BASE_URL;

const UserDetailForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email_or_phone: "",
    school_name: "",
    dob: "",
    gender: "",
    mobileNumber: "",
    city: "",
    state: "",
    country: "",
    selectedTestSeriesId: "",
  });

  const [testSeriesList, setTestSeriesList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial user and test series data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [userResponse, testSeriesResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // ... (userResponse logic remains the same)
        if (userResponse.data) {
          setFormData((prevData) => ({
            ...prevData,
            ...userResponse.data,
            mobileNumber: userResponse.data.mobileNumber || "",
            dob: userResponse.data.dob || "",
            gender: userResponse.data.gender || "",
            city: userResponse.data.city || "",
            state: userResponse.data.state || "",
            country: userResponse.data.country || "",
          }));
        }

        // ✅ SOLUTION: Validate that the response data is an array
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setTestSeriesList([]); // Also default to an empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear validation error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile Number is required.";
    } else if (!/^\d{10,15}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid mobile number.";
    }
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.selectedTestSeriesId)
      newErrors.selectedTestSeriesId = "Please select a test series.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      // POST the updated and new details to the backend
      await axios.post("/api/user-details", formData);

      // Redirect to the payment page with the selected test series ID
      navigate(`/payment/${formData.selectedTestSeriesId}`);
    } catch (error) {
      console.error("Failed to update user details:", error);
      // Optionally, set a general form error to display to the user
      setErrors((prev) => ({
        ...prev,
        form: "Failed to save details. Please try again.",
      }));
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <motion.div
      className="form-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="user-detail-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="form-header">
          <h2>Complete Your Profile</h2>
          <p>
            Review your details and add the required information to proceed.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* --- Pre-filled Signup Details --- */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.full_name}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailOrPhone">Email / Phone</label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.email_or_phone}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="schoolName">School Name</label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.school_name}
                readOnly
              />
            </div>

            {/* --- Additional Required Fields --- */}
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              {errors.dob && (
                <span className="error-message">{errors.dob}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <span className="error-message">{errors.gender}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="e.g., 9876543210"
                required
              />
              {errors.mobileNumber && (
                <span className="error-message">{errors.mobileNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Aligarh"
                required
              />
              {errors.city && (
                <span className="error-message">{errors.city}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g., Uttar Pradesh"
                required
              />
              {errors.state && (
                <span className="error-message">{errors.state}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., India"
                required
              />
              {errors.country && (
                <span className="error-message">{errors.country}</span>
              )}
            </div>

            {/* --- Purchase Section --- */}
            <div className="form-group full-width">
              <label htmlFor="selectedTestSeriesId">Select Test Series</label>
              <select
                id="selectedTestSeriesId"
                name="selectedTestSeriesId"
                value={formData.selectedTestSeriesId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Choose a test series to purchase
                </option>
                {testSeriesList.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.name}
                  </option>
                ))}
              </select>
              {errors.selectedTestSeriesId && (
                <span className="error-message">
                  {errors.selectedTestSeriesId}
                </span>
              )}
            </div>
          </div>

          {errors.form && (
            <div className="error-message form-error">{errors.form}</div>
          )}

          <button type="submit" className="submit-btn">
            Proceed to Payment
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserDetailForm;
