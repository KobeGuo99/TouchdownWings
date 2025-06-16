import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaClock, FaPhone, FaMapMarkerAlt, FaDoorOpen, FaDoorClosed, FaUtensils } from 'react-icons/fa';
import './HoursContact.css';

// Override variable - set to true to force restaurant open, false to force closed, null for normal time-based check
const FORCE_RESTAURANT_STATUS = null;

function HoursContact() {
  // Check if restaurant is currently open in Central Time
  const isCurrentlyOpen = () => {
    // If override is set, return that value
    if (FORCE_RESTAURANT_STATUS !== null) {
      return FORCE_RESTAURANT_STATUS;
    }

    // Get current time in Central Time
    const now = new Date();
    const centralTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    const day = centralTime.getDay();
    const hour = centralTime.getHours();
    const minute = centralTime.getMinutes();
    const currentTime = hour + minute / 60;

    if (day === 1) return false; // Monday
    if (day === 0) return currentTime >= 12 && currentTime < 20.5; // Sunday
    if (day === 6) return currentTime >= 11 && currentTime < 21.5; // Saturday
    if (day === 5) return currentTime >= 11 && currentTime < 21.5; // Friday
    return currentTime >= 11 && currentTime < 21; // Tuesday-Thursday
  };

  return (
    <div className="hours-contact-section">
      <Container>
        <div className="content-wrapper">
          <Row className="justify-content-center mb-4">
            <Col md={8} className="text-center">
              <h1 className="display-5 text-white mb-2">Visit Us Today</h1>
              <p className="lead text-white-50 mb-3">Experience the best wings in Tullahoma</p>
              <span className={`status-badge ${isCurrentlyOpen() ? 'open' : 'closed'}`}>
                {isCurrentlyOpen() ? (
                  <>
                    <FaDoorOpen className="me-2" />
                    Currently Open
                  </>
                ) : (
                  <>
                    <FaDoorClosed className="me-2" />
                    Currently Closed
                  </>
                )}
              </span>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="card-wrapper">
                <div className="icon-wrapper">
                  <FaClock />
                </div>
                <h2 className="section-title">Hours of Operation</h2>
                <div className="info-item">
                  <div className="time-display">
                    <span className="day">Monday  </span>
                    <span className="time text-danger">Closed</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="time-display">
                    <span className="day">Tuesday - Thursday  </span>
                    <span className="time">11am - 9pm</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="time-display">
                    <span className="day">Friday & Saturday</span>
                    <span className="time">11am - 9:30pm</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="time-display">
                    <span className="day">Sunday</span>
                    <span className="time">12pm - 8:30pm</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="card-wrapper">
                <div className="icon-wrapper">
                  <FaPhone />
                </div>
                <h2 className="section-title">Contact Us</h2>
                <div className="info-item">
                  <p className="mb-2 text-muted">Call us for takeout</p>
                  <a href="tel:9319132888" className="phone-number">
                    (931) 913-2888
                  </a>
                </div>
                {/* <div className="info-item">
                  <p className="mb-2 text-muted">Order online for </p>
                  <a 
                    href="https://www.toasttab.com/touchdown-wings-1408-n-jackson-st/v3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-button primary"
                  >
                    <FaUtensils className="me-2" />
                    Order Now
                  </a>
                </div> */}

              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="card-wrapper">
                <div className="icon-wrapper">
                  <FaMapMarkerAlt />
                </div>
                <h2 className="section-title">Location</h2>
                <div className="info-item">
                  <p className="address-text street">1408 N Jackson St.</p>
                  <p className="address-text">Tullahoma, TN 37388</p>
                </div>
                <div className="info-item">
                  <p className="mb-2 text-muted">Get directions to our restaurant</p>
                  <a 
                    href="https://www.google.com/maps?q=1408+N+Jackson+St+Tullahoma+TN+37388"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-button outline"
                  >
                    <FaMapMarkerAlt className="me-2" />
                    Open in Maps
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default HoursContact;

