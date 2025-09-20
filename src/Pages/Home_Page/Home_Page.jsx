// src/HomePage.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 1. IMPORT NavDropdown and Image
import {
  Navbar,
  Nav,
  Button,
  Offcanvas,
  Container,
  NavDropdown,
  Image,
} from "react-bootstrap";

// Import Views
import DashboardView from "./Dashboardview.jsx";
import MyTestsView from "./MyTestsView";
import TestScheduleView from "./TestScheduleView";
import ResultsView from "./ResultsView";
import AskADoubtView from "./AskdoubtView";
import ProfileView from "./Profile.jsx"; // 2. IMPORT THE NEW PROFILE VIEW

// Import Icons
import {
  DashboardIcon,
  MyTestsIcon,
  ScheduleIcon,
  ResultsIcon,
  DoubtIcon,
  LogoutIcon,
} from "./Icons";

import "./Home_Page.css";
import { useNavigate } from "react-router-dom";

// --- Sidebar Menu Data ---
const sidebarMenuItems = [
  { name: "Dashboard", icon: <DashboardIcon />, view: <DashboardView /> },
  { name: "My Tests", icon: <MyTestsIcon />, view: <MyTestsView /> },
  { name: "Test Schedule", icon: <ScheduleIcon />, view: <TestScheduleView /> },
  { name: "Results", icon: <ResultsIcon />, view: <ResultsView /> },
  { name: "Ask a Doubt", icon: <DoubtIcon />, view: <AskADoubtView /> },
  // Note: Profile is handled separately in the header but uses the same view logic
];

// --- Reusable Sidebar Content ---
// ... (SidebarContent component remains unchanged)
const SidebarContent = ({ activeItem, handleMenuClick, handleLogout }) => (
  <>
    <div className="sidebar-header p-3">
      <h3 className="mb-0">AspireClasses</h3>
    </div>
    <Nav className="flex-column flex-grow-1 p-2">
      {sidebarMenuItems.map((item) => (
        <Nav.Link
          key={item.name}
          active={activeItem === item.name}
          onClick={() => handleMenuClick(item.name)}
          className="d-flex align-items-center sidebar-btn"
        >
          {item.icon}
          <span className="ms-3">{item.name}</span>
        </Nav.Link>
      ))}
    </Nav>
    <div className="p-2">
      <Button
        variant="danger"
        className="w-100 d-flex align-items-center justify-content-center sidebar-btn"
        onClick={handleLogout}
      >
        <LogoutIcon />
        <span className="ms-3">Logout</span>
      </Button>
    </div>
  </>
);

// --- Main HomePage Component ---
const HomePage = () => {
  const [username, setUserName] = useState("User"); // Default value
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name);
    }
  }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleMenuClick = (name) => {
    setActiveItem(name);
    setSidebarOpen(false);
  };

  // 3. UPDATED: More flexible function to render the active view
  const renderActiveView = () => {
    switch (activeItem) {
      case "Dashboard":
        return <DashboardView />;
      case "My Tests":
        return <MyTestsView />;
      case "Test Schedule":
        return (
          <TestScheduleView
            onNavigateToProfile={() => handleMenuClick("Profile")}
          />
        );
      case "Results":
        return <ResultsView />;
      case "Ask a Doubt":
        return <AskADoubtView />;
      case "Profile": // Handle the new "Profile" case
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  // The content for the dropdown menu title
  const profileMenuTitle = (
    <>
      <Image
        src={`https://api.dicebear.com/8.x/initials/svg?seed=${username}`}
        roundedCircle
        width="30"
        height="30"
        className="me-2"
      />
      {username}
    </>
  );

  return (
    <div className="home-page-layout">
      {/* ... (Desktop Sidebar and Mobile Offcanvas remain unchanged) ... */}
      <div className="sidebar-desktop d-none d-lg-flex flex-column">
        <SidebarContent
          activeItem={activeItem}
          handleMenuClick={handleMenuClick}
        />
      </div>
      <Offcanvas
        show={isSidebarOpen}
        onHide={() => setSidebarOpen(false)}
        className="sidebar-mobile d-lg-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column p-0">
          <SidebarContent
            activeItem={activeItem}
            handleMenuClick={handleMenuClick}
            handleLogout={handleLogout}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <main className="main-content">
        {/* 4. MODIFIED: The main header Navbar */}
        <Navbar bg="dark" variant="dark" expand={false} className="main-header">
          <Container fluid>
            <Button
              variant="outline-light"
              className="d-lg-none"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </Button>

            {/* Title of the current active page */}
            <Navbar.Brand className="d-none d-md-block">
              {activeItem}
            </Navbar.Brand>

            {/* Profile Dropdown Menu */}
            <Nav className="ms-auto">
              <NavDropdown
                title={profileMenuTitle}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => handleMenuClick("Profile")}>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => handleLogout()}
                  className="text-danger"
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>

        <div className="content-wrapper p-3 p-md-4">
          <AnimatePresence mode="wait">
            <motion.div key={activeItem}>
              {renderActiveView()} {/* Use the new render function */}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
