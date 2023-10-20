import React from "react";
import logo from "../assets/tdw_logo.png";
import "./Header.css";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
      <div className="container d-flex flex-lg-row flex-column justify-content-between align-items-center">
        <div className="logo-container d-flex justify-content-center flex-grow-1">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              alt="Touchdown Wings Logo"
              width="200"
              className="mr-3"
            />
          </a>
        </div>

        <div className="navbar-text mb-0 font-weight-bold text-danger outlined-text text-center flex-grow-1">
          <h1 className="">Touchdown Wings</h1>
          <p className="fs-2 mb-0">Tullahoma, TN</p>
        </div>

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
