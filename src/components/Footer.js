import React from "react";
import "./Footer.css";
import logo from "../assets/tdw_logo.png";

function Footer() {
  return (
    <footer className="footer bg-dark text-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-center text-md-left">
            <a href="#">
              <img
                src={logo}
                alt="Touchdown Wings Logo"
                width="200"
                className="mb-3"
              />
            </a>
          </div>
          <div className="col-md-4 text-center mb-3">
            <p className="mb-2">(931) 913-2888</p>
            <p>1408 N Jackson St.</p>
            <p>Tullahoma, TN 37388</p>
          </div>
          <div className="col-md-4 text-center text-md-right">
            <p className="mb-0">
              &copy; 2023 Touchdown Wings. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
