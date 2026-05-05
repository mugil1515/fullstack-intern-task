import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { FavouriteProvider } from "./context/FavouriteContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Store/Home";
import Store from "./pages/Store/Store";
import TemplateDetail from "./pages/Store/TemplateDetail";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Admin from "./pages/Admin/Admin";
import Favourites from "./pages/Favourites/Favourites";

import "./styles/globals.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <FavouriteProvider>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/store/:slug" element={<TemplateDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/favourites"
                    element={
                      <ProtectedRoute>
                        <Favourites />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Only */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </FavouriteProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
