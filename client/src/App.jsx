import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TestDashboard from "./pages/TestDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TestPreview from "./pages/TestPreview";
import TestResult from "./pages/TestResult";
import Quiz from "./Quiz/Quiz";
import ErrorPage from "./pages/ErrorPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Private from "./pages/Private";

const App = () => {
  const TestName = "EcoSysytem-Test";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Private />}>
          <Route
            path="/test-dashboard"
            element={<TestDashboard TestName={TestName} />}
          />
          <Route
            path="/:testName-preview"
            element={<TestPreview TestName={TestName} />}
          />
          <Route
            path={
              "/:testName-quiz/total-questions-/:totalQuestions/marks-per-question-/:marksPerQuestion/negative-marking-/:negativeMarking/time-available-/:timeAvailable"
            }
            element={<Quiz TestName={TestName} />}
          />
          <Route
            path="/:testName-result"
            element={<TestResult TestName={TestName} />}
          />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
