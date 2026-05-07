import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages";
import TestPage from "./pages/TestPage";
import JobApps from "./pages/JobApps"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/job-apps" element={<JobApps />} />
      </Routes>
    </Router>
  );
}

export default App;
