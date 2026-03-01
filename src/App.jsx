import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ReservationProvider } from "./context/ReservationProvider.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReservationProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid #3f3f46',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#18181b' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#18181b' },
              },
            }}
          />
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