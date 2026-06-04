import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./layout.css";

function MainLayout() {
  return (
    <div className="app-container">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="main-section">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;