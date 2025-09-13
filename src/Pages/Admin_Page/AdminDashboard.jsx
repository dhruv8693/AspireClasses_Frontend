// src/components/AdminDashboard.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Navbar, Button, Offcanvas } from "react-bootstrap";
import Sidebar from "./Sidebar"; // Your existing Sidebar component
import "./AdminDashboard.css"; // We'll link to a new, smaller CSS file

const AdminDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  return (
    <div className="admin-dashboard-layout">
      {/* 1. Desktop Sidebar (hidden on small screens) */}
      <div className="admin-sidebar d-none d-lg-flex">
        <Sidebar />
      </div>

      {/* 2. Mobile Offcanvas Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={handleSidebarClose}
        responsive="lg"
        className="admin-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar handleClose={handleSidebarClose} />{" "}
          {/* Pass handleClose to close on nav */}
        </Offcanvas.Body>
      </Offcanvas>

      {/* 3. Main Content Area */}
      <main className="admin-content">
        {/* Mobile Header with Toggle Button */}
        <Navbar bg="dark" variant="dark" className="d-lg-none mb-3">
          <Container fluid>
            <Button variant="outline-light" onClick={handleSidebarShow}>
              ☰ Menu
            </Button>
            <Navbar.Brand href="#home">Admin Panel</Navbar.Brand>
          </Container>
        </Navbar>

        {/* The content from your routed components will be displayed here */}
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
