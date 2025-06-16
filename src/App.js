import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Header from './components/Header';
import HoursContact from './components/HoursContact';
import ModernMenu from './components/ModernMenu';
import Footer from './components/Footer';
import FoodGallery from './components/FoodGallery';
import AlertMessage from './components/Alert';
import { useState } from 'react';
import './App.css';

function App() {
  const [alertMessage, setAlertMessage] = useState('Closed on Fri., March 14 - Thurs., March 20. Will reopen on Friday, March 21. Sorry for the inconvenience!');
  
  return (
    <div className="app">
      <Header />
      <AlertMessage message={alertMessage} />
      <HoursContact />
      <ModernMenu />
      <FoodGallery />
      <Footer />
    </div>
  );
}

export default App;
