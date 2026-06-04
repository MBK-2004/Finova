import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        Finovo 💰
      </div>

      {/* Nav Buttons */}
      <nav className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>
    </header>
  );
}

export default Header;