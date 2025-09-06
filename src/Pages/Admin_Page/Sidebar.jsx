import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="sidebars">
      <h2 className="sidebar-title">Admin Menu</h2>
      <nav className="sidebar-nav">
        <NavLink to="/admin/assign-test" className="sidebar-link">
          Assign Test
        </NavLink>
        <NavLink to="/admin/update-questions" className="sidebar-link">
          Update Questions
        </NavLink>
        <NavLink to="/admin/create-test" className="sidebar-link">
          Create New Test
        </NavLink>
      </nav>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
