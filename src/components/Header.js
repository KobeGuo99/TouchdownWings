import React from "react";
import logo from "../assets/tdw_logo.png";
import "./Header.css";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark dark-background py-3">
      <div className="container d-flex flex-lg-row flex-column justify-content-between align-items-center text-box">
        <div className="logo-container">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              alt="Touchdown Wings Logo"
              width="200"
              className="mr-3"
            />
          </a>
        </div>

        <div className="navbar-text mb-0 font-weight-bold outlined-text text-center d-flex flex-column justify-content-center align-items-center">
          <p className="fs-1">Touchdown Wings</p>
          <p className="fs-2 mb-0">Tullahoma, TN</p>
        </div>
      </div>
    </nav>
  );
}

export default Header;
