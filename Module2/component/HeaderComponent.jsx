import React from "react";
import logo from "../assets/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { isUserLoggedIn, logout } from "../service/AuthApiService";
import "../css/style.css";

const HeaderComponent = () => {
  const isAuth = isUserLoggedIn();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      {/* Modern Glass Navbar */}
      <nav className="navbar navbar-expand-lg glass-nav fixed-top shadow-sm">
        <div className="container">
          {/* 🔹 Logo + Branding */}
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="logo" width={40} height={40} className="me-2" />
            <span className="brand-text">TaskBuddy</span>
          </NavLink>

          {/* 🔹 Mobile Toggle */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* 🔹 Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto gap-3 align-items-center">
              {isAuth ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link custom-link" to="/add-task">
                      Add Task
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link custom-link" to="/tasks">
                      Pending Tasks
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link custom-link" to="/completedtask">
                      Completed Tasks
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link logout-link"
                      to="/login"
                      onClick={handleLogout}
                    >
                      Logout
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link custom-link" to="/create-account">
                      Create Account
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link custom-link" to="/login">
                      Login
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* 🧩 Adds spacing so content isn’t hidden behind navbar */}
      <div style={{ paddingTop: "60px" }}></div>
    </>
  );
};

export default HeaderComponent;
