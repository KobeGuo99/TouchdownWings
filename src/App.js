import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Header from './components/Header';
import HoursContact from './components/HoursContact';
import Menu from './components/Menu';
import Footer from './components/Footer';
import FoodGallery from './components/FoodGallery';
import AlertMessage from './components/Alert';
import { useState } from 'react';

function App() {
  const [alertMessage, setAlertMessage] = useState('We will be closed on Saturday, May 25 - Mon., June 3. We will reopen on Tuesday, June 4. Sorry for the inconvenience! ');
  return (
    <div>
      <Header />
      <AlertMessage message={alertMessage} />
      <HoursContact />
      <Menu />
      {/* <FoodGallery /> */}
      <Footer />
    </div>
  );
}

export default App;
