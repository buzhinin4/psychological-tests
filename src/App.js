import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThemesPage from "./pages/ThemesPage/ThemesPage.jsx";
import TestsPage from "./pages/TestsPage/TestsPage.jsx";
import TestSolvingPage from "./pages/TestSolvingPage/TestSolvingPage.jsx";
import TestResultsPage from "./pages/TestResultsPage/TestResultsPage.jsx";
import TestErrorPage from "./pages/TestErrorPage/TestErrorPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ThemesPage />} />
        <Route path="/themes/:themeId/tests" element={<TestsPage />} />
        <Route
          path="/themes/:themeId/tests/:testId"
          element={<TestSolvingPage />}
        />
        <Route
          path="/themes/:themeId/tests/:testId/results"
          element={<TestResultsPage />}
        />
        <Route path="/test-error" element={<TestErrorPage />} />
        <Route path="*" element={<TestErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
