import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">

      <h2 className="logo">💰 Finovo</h2>

      <Link to="/app">🏠 Home</Link>
      <Link to="/app/groups">👥 Groups</Link>

      <button className="logout" onClick={handleLogout}>
        🚪 Logout
      </button>

    </div>
  );
}

export default Sidebar;