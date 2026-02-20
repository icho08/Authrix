import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import DashboardLayout from "./components/DashboardLayout";
import DocsLayout from "./components/DocsLayout";
import LandingPage from "./pages/LandingPage";
import Changelog from "./pages/Changelog";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Pricing from "./pages/Pricing";
import Overview from "./pages/dashboard/Overview";
import Users from "./pages/dashboard/Users";
import Integration from "./pages/dashboard/Integration";
import Settings from "./pages/dashboard/Settings";
import UserSettings from "./pages/dashboard/UserSettings";
import Vulnerability from "./pages/dashboard/Vulnerability";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import StaffLogin from "./pages/admin/support/StaffLogin";
import SupportDashboard from "./pages/admin/support/SupportDashboard";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
            <Route path="/docs" element={<DocsLayout />} />
            <Route path="/docs/:id" element={<DocsLayout />} />
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <RegisterPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthRedirect>
                  <ForgotPasswordPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Overview />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/integration"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Integration />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vulnerability"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Vulnerability />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/account"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UserSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/support"
              element={
                <ProtectedRoute>
                  <SupportDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
