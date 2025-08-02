
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Dashboard from "./Components/Pages/Dashboard";
import "./index.css";
import ProfileClaiming from "./Components/Pages/ProfileClaiming";
import SocialConnect from "./Components/Pages/SocialConnect";

import ReferralsTab from "./Components/Pages/ReferralsTab";
import ReferralLeaderboard from "./Components/Pages/ReferralLeaderboard";

import Home from "./Components/Pages/Home";
import { Toaster } from "sonner";
import MainLayout from "../MainLayout"
import ViewProfile from "./Components/Pages/ViewProfile";
import PreferencesSetup from "./Components/Pages/PreferencesSetup";
import KycSetup from "./Components/Pages/KycSetup";
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="home" element={<Home />} />
            <Route path="referrals" element={<ReferralsTab />} />
            <Route path="/dashboard/leaderboard" element={<ReferralLeaderboard />} />
            <Route path="claim-profile" element={<ProfileClaiming />} />
            <Route path="view-profile/:id" element={<ViewProfile />} />
            <Route path="onboarding/social" element={<SocialConnect />} />
            <Route path="onboarding/kyc" element={<KycSetup />} />
            <Route path="onboarding/preferences" element={<PreferencesSetup />} />
        </Route>
      </Routes>
    </Router>
    <Toaster />
  </React.StrictMode>
);