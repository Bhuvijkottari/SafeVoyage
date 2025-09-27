// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import SOSPage from "./pages/SOSPage";
import InfoPage from "./pages/InfoPage";
import ChatbotPage from './pages/ChatbotPage';
import RouteFinderPage from "./pages/RouteFinderPage";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import WeatherConditionsPage from "./pages/WeatherConditionsPage";
import ReportPage from './pages/ReportPage';
import TravelTipsPage from "./pages/TravelTipsPage";

// Protected route wrapper
function ProtectedRoute({ children, role }) {
  const current = JSON.parse(localStorage.getItem("safevoyage_current"));
  if (!current) return <Navigate to="/auth" replace />;
  if (role && current.role !== role) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Default redirect to auth page */}
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* Authentication page */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Home page (for users) */}
      <Route
        path="/home"
        element={
          <ProtectedRoute role="user">
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Authority Dashboard page */}
      <Route
        path="/authoritydashboard"
        element={
          <ProtectedRoute role="authority">
            <AuthorityDashboard />
          </ProtectedRoute>
        }
      />

      {/* Other pages */}
      <Route path="/weather" element={<WeatherConditionsPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route
        path="/sos"
        element={
          <ProtectedRoute>
            <SOSPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/info"
        element={
          <ProtectedRoute>
            <InfoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tips"
        element={
          <ProtectedRoute>
            <TravelTipsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/route-finder" element={<RouteFinderPage />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
