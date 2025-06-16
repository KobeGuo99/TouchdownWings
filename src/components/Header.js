import React from "react";
import { Link } from "react-scroll";
import { FaChevronDown } from "react-icons/fa";
import logo from "../assets/tdw_logo.png";
import "./Header.css";

function Header() {
  return (
    <div className="header-section">
      <div className="container">
        <div className="header-content">
          <div className="logo-wrapper">
            <img
              src={logo}
              alt="Touchdown Wings Logo"
              className="header-logo"
            />
          </div>
          <div className="header-text">
            <h1>Touchdown Wings</h1>
            <p>Tullahoma, TN</p>
          </div>
          <Link
            to="menu-section"
            spy={true}
            smooth={false}
            duration={0}
            className="menu-button"
          >
            <span>View Menu</span>
            <FaChevronDown />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;

