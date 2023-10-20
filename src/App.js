import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Header from './components/Header';
import HoursContact from './components/HoursContact';
import Menu from './components/Menu';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <HoursContact />
      <Menu />
      <Footer />
    </div>
  );
}

export default App;
