import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/authContext";
import Layout from "./components/Layout/Layout";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import FarmerDashboard from "./components/Farmer/FarmerDashboard";
import BuyerDashboard from "./components/Buyer/BuyerDashboard";
// Light green theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#81c784", // Light green
      contrastText: "#fff",
    },
    secondary: {
      main: "#66bb6a", // Medium green
    },
    background: {
      default: "#f1f8e9", // Very light green
      paper: "#ffffff", // White for cards
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: "#2e7d32", // Dark green for headings
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "8px 16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/register"
              element={
                <Layout>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Layout>
                  <ForgotPassword />
                </Layout>
              }
            />
            <Route
              path="/reset-password/:username/:token"
              element={
                <Layout>
                  <ResetPassword />
                </Layout>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />

            <Route path="/buyer/*" element={<BuyerDashboard />} />
            <Route path="/farmer/*" element={<FarmerDashboard />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
