
import React from 'react';
import './Alert.css';
import { Container } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const AlertMessage = ({ isActive, message }) => {
  if (!isActive || !message) {
    return null;
  }

  return (
    <section className="special-closure-alert" aria-live="polite">
      <Container>
        <div className="special-closure-content">
          <FaExclamationTriangle className="special-closure-icon" />
          <div>
            {/* <p className="special-closure-label">Special Closure Notice</p> */}
            <p className="special-closure-message">{message}</p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AlertMessage;
