import Header from "./components/Header";
import AlertMessage from "./components/Alert";
import HoursContact from "./components/HoursContact";
import ModernMenu from "./components/ModernMenu";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import { specialClosure } from "./components/SiteSettings";
import checkConfig from "./components/configCheck";
import "./App.css";

// warns in the console during `npm start` if MenuData.js or
// SiteSettings.js has a typo; does nothing on the deployed site
checkConfig();

function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#menu">Skip to the menu</a>
      <StructuredData />
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
