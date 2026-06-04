

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./components/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";

// Layout & Auth
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🧾 PROTECTED APP */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* default dashboard */}
          <Route index element={<Home />} />

          {/* ✅ FIXED: relative paths (NO /app here) */}
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupDetails />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;