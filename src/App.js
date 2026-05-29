import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Header from './components/Header';
import HoursContact from './components/HoursContact';
import ModernMenu from './components/ModernMenu';
import Footer from './components/Footer';
import AlertMessage from './components/Alert';
import { specialClosure } from './components/SiteSettings';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <AlertMessage
        isActive={specialClosure.isActive}
        message={specialClosure.message}
      />
      <HoursContact />
      <ModernMenu />
      <Footer />
    </div>
  );
}

export default App;
