
import React from 'react';
import './HoursContact.css';

function HoursContact() {
  return (
    <div className="hours-contact-bg text-black py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <h2 className="card-title mb-3 text-color-red">Hours of Business</h2>
                <p className="card-text">CLOSED MONDAYS</p>
                <p className="card-text">Tuesday - Thursday: 11am - 9pm</p>
                <p className="card-text">Friday & Saturday: 11am - 9:30pm</p>
                <p className="card-text">Sunday: Noon - 8:30pm</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <h2 className="card-title">Contact</h2>
                <p className="card-text">Phone: (931) 913-2888</p>
                <p className="card-text mb-0">Address: 1408 N Jackson St.</p>
                <p>Tullahoma, TN 37388</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoursContact;

