// src/HomePage.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, Nav, Button, Offcanvas, Container } from "react-bootstrap";

// Import Views
import DashboardView from "./Dashboardview.jsx";
import MyTestsView from "./MyTestsView";
import TestScheduleView from "./TestScheduleView";
import ResultsView from "./ResultsView";
import AskADoubtView from "./AskdoubtView";

// Import Icons
import {
  DashboardIcon,
  MyTestsIcon,
  ScheduleIcon,
  ResultsIcon,
  DoubtIcon,
  LogoutIcon,
} from "./Icons";

// Import new simplified CSS
import "./Home_Page.css";

// --- Sidebar Menu Data ---
const sidebarMenuItems = [
  { name: "Dashboard", icon: <DashboardIcon />, view: <DashboardView /> },
  { name: "My Tests", icon: <MyTestsIcon />, view: <MyTestsView /> },
  { name: "Test Schedule", icon: <ScheduleIcon />, view: <TestScheduleView /> },
  { name: "Results", icon: <ResultsIcon />, view: <ResultsView /> },
  { name: "Ask a Doubt", icon: <DoubtIcon />, view: <AskADoubtView /> },
];

// --- Reusable Sidebar Content ---
const SidebarContent = ({ activeItem, handleMenuClick }) => (
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
      >
        <LogoutIcon />
        <span className="ms-3">Logout</span>
      </Button>
    </div>
  </>
);

// --- Main HomePage Component ---
const HomePage = () => {
  const [username, setUserName] = useState("");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name);
    }
  }, []);

  const handleMenuClick = (name) => {
    setActiveItem(name);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const activeView = sidebarMenuItems.find((item) => item.name === activeItem)
    ?.view || <DashboardView />;

  return (
    <div className="home-page-layout">
      {/* 1. Desktop Sidebar (Visible only on large screens) */}
      <div className="sidebar-desktop d-none d-lg-flex flex-column">
        <SidebarContent
          activeItem={activeItem}
          handleMenuClick={handleMenuClick}
        />
      </div>

      {/* 2. Mobile Offcanvas Sidebar */}
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
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* 3. Main Content Area */}
      <main className="main-content">
        <Navbar bg="dark" variant="dark" expand={false} className="main-header">
          <Container fluid>
            {/* Hamburger button to toggle mobile sidebar */}
            <Button
              variant="outline-light"
              className="d-lg-none"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </Button>
            <Navbar.Brand className="mx-auto">
              Welcome back, {username}!
            </Navbar.Brand>
          </Container>
        </Navbar>

        <div className="content-wrapper p-3 p-md-4">
          <AnimatePresence mode="wait">
            {/* We add a key to make AnimatePresence work on content change */}
            <motion.div key={activeItem}>{activeView}</motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
