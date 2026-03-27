import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Navbar from "./components/Navbar";
import UploadPage from "./components/UploadPage";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/detect" element={<UploadPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;