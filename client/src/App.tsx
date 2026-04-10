import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
// import { UserForm } from "./pages/UserForm";

import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./features/auth/auth.context";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* <Route
            path="/users/new"
            element={
              <ProtectedRoute>
                <UserForm/>
            </ProtectedRoute>
          }
          /> */}

          {/* <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            }
          /> */}

          {/* fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
