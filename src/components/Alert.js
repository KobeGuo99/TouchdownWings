
import React from 'react';
import './Alert.css';
import { Alert } from 'react-bootstrap';

const AlertMessage = ({ message }) => {
  return (
    <Alert variant="warning" className="custom-alert">
      {message}
    </Alert>
  );
};

export default AlertMessage;
