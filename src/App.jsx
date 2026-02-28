import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import { AuthProvider } from "./context/AuthProvider";
import { ReservationProvider } from "./context/ReservationProvider";
import CheckoutPage from "./pages/CheckoutPage";


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReservationProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={<DashboardPage />}
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
          </Routes>
        </ReservationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;