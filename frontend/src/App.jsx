import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CountryList from "./components/CountryList";
import CountryInfo from "./components/CountryInfo";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<CountryList />} />
          <Route path="/country/:countryCode" element={<CountryInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
