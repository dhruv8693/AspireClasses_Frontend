import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// Import CSS
import "./Home_Page.css";

const HomePage = () => {
  const [username, setUserName] = useState("");
  const [activeItem, setActiveItem] = useState("Dashboard"); // Default to Dashboard
  const [isSidebarOpen, setSidebarOpen] = useState(false); // For mobile

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name);
    }
  }, []);

  const sidebarMenuItems = [
    { name: "Dashboard", icon: <DashboardIcon /> },
    { name: "My Tests", icon: <MyTestsIcon /> },
    { name: "Test Schedule", icon: <ScheduleIcon /> },
    { name: "Results", icon: <ResultsIcon /> },
    { name: "Ask a Doubt", icon: <DoubtIcon /> },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case "My Tests":
        return <MyTestsView />;
      case "Dashboard":
        return <DashboardView />;
      case "Test Schedule":
        return <TestScheduleView />;
      case "Results":
        return <ResultsView />;
      case "Ask a Doubt":
        return <AskADoubtView />;
      default:
        return <DashboardView />;
    }
  };

  const handleMenuClick = (name) => {
    setActiveItem(name);
    setSidebarOpen(false); // close on mobile after navigation
  };

  return (
    <div className="home-page home-body">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close Sidebar"
        >
          ✕
        </button>
        <div className="sidebar-header">
          <h1>Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          {sidebarMenuItems.map((item) => (
            <motion.a
              href="#"
              key={item.name}
              className={`sidebar-btn ${
                activeItem === item.name ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.name)}
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              transition={{ duration: 0.2 }}
            >
              {item.icon}
              <span>{item.name}</span>
            </motion.a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <motion.a
            href="#"
            className="sidebar-btn logout-btn"
            whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}
          >
            <LogoutIcon />
            <span>Logout</span>
          </motion.a>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`dashboard-main ${isSidebarOpen ? "overlay" : ""}`}>
        <header className="dashboard-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
          <h1 className="welcome-message">Welcome back, {username}!</h1>
        </header>
        <div className="dashboard-content">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
