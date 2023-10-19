import React from "react";
import logo from "../assets/tdw_logo.png";
import "./Header.css";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
      <div className="container d-flex justify-content-around">
        <a className="navbar-brand" href="#">
          <img
            src={logo}
            alt="Touchdown Wings Logo"
            width="200"
            className="mr-3"
          />
        </a>
        <div className="navbar-text h1 mb-0 font-weight-bold text-danger fs-1 outlined-text text-center">
          <h1>Touchdown Wings</h1>
          <p>Tullahoma, TN</p>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
          <div className="d-flex justify-content-center text-center">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Menu
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
