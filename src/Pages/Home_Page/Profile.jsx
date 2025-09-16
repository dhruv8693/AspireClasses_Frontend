// src/Profile.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons"; // A nice default icon

const ProfileView = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Load user data from local storage on component mount
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUser({
        fullName: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "Not provided", // Example field
      });
    }
  }, []);

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend API
    alert("Profile changes saved! (Simulated)");
    console.log("Updated user data:", user);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    // In a real app, you would send this to a password change endpoint
    alert("Password changed successfully! (Simulated)");
    console.log("Attempting to change password with:", passwords.current);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header as="h4">My Profile</Card.Header>
            <Card.Body>
              <Row>
                {/* Profile Picture Section */}
                <Col md={4} className="text-center mb-4 mb-md-0">
                  <Image
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName}`}
                    roundedCircle
                    style={{ width: "150px", height: "150px" }}
                    className="mb-3"
                  />
                  <h5>{user.fullName}</h5>
                  <p className="text-muted">{user.email}</p>
                  <Button variant="outline-primary" size="sm">
                    Upload New Picture
                  </Button>
                </Col>

                {/* Personal Information Form */}
                <Col md={8}>
                  <h5>Personal Information</h5>
                  <Form onSubmit={handleSaveChanges}>
                    <Form.Group className="mb-3" controlId="formFullName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleUserChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleUserChange}
                        disabled // Usually, email is not editable
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleUserChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                  </Form>
                  <hr />
                  {/* Change Password Form */}
                  <h5>Change Password</h5>
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group
                      className="mb-3"
                      controlId="formCurrentPassword"
                    >
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                      />
                    </Form.Group>
                    <Row>
                      <Col sm={6}>
                        <Form.Group
                          className="mb-3"
                          controlId="formNewPassword"
                        >
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="new"
                            value={passwords.new}
                            onChange={handlePasswordChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group
                          className="mb-3"
                          controlId="formConfirmPassword"
                        >
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirm"
                            value={passwords.confirm}
                            onChange={handlePasswordChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="secondary" type="submit">
                      Update Password
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileView;
