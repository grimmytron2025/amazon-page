import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import BillingInfo from "./pages/Billing/BillingInfo";
import VerificationOptions from "./pages/Auth/VerificationOptions";
import OTPVerification from "./pages/Auth/OTPVerification";
import ProtectedRoute from "./components/ProtectedRoute";
import Success from "./pages/Success/Success";
import FinalStep from "./pages/Auth/FinalStep";
import AntiBot from "./components/AntiBot";

function App() {
  return (
    <AntiBot>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/final-step" element={<FinalStep />} />
          <Route
            path="/success"
            element={
              <ProtectedRoute requiredFlow="verified">
                <Success />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute requiredFlow="login">
                <BillingInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification-options"
            element={
              <ProtectedRoute requiredFlow="billing">
                <VerificationOptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute requiredFlow="billing">
                <OTPVerification />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AntiBot>
  );
}

export default App;
