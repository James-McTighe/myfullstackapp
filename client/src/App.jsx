import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages";
import About from "./pages/about";
import JobApps from "./pages/JobApps"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/job-apps" element={<JobApps />} />
      </Routes>
    </Router>
  );
}

export default App;
