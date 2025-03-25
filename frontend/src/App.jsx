import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";

export const serverUrl = "http://localhost:5000";

function App() {

  const loading = useGetCurrentUser();

  const user = useSelector((state) => state.user.userData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* AUTH ROUTES */}
      <Route
        path="/signup"
        element={!user ? <SignUp /> : <Navigate to="/" />}
      />

      <Route
        path="/signin"
        element={!user ? <SignIn /> : <Navigate to="/" />}
      />

      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/" />}
      />

      {/* PROTECTED */}
      <Route
        path="/"
        element={user ? <Home /> : <Navigate to="/signin" />}
      />

    </Routes>
  );
}

export default App;