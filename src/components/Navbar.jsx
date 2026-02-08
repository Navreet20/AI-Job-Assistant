import React from "react";
import "./Navbar.css";

export default function Navbar({ isLoggedIn, onLoginClick, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">AI Job Assist</div>

      <div className="nav-actions">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
