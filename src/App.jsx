import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";

const AdminDashboard = lazy(() => import("./components/admin/AdminDashborad"));
const DoctorDashboard = lazy(() => import("./components/doctor/DoctorDashboard"));
const HospitalDashboard = lazy(() => import("./components/hospital/HospitalDashboard"));
const HomePage = lazy(() => import("./components/public/HomePage"));
const UserDashboard = lazy(() => import("./components/user/UserDashboard"));

function ProtectedRoute({ user, children }) {
  const token = localStorage.getItem("hmsToken");

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("hmsUser");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);

  const loginHandler = (authData, options = {}) => {
    const loggedUser = authData.user || authData;
    const token = authData.token || localStorage.getItem("hmsToken");

    localStorage.setItem("hmsUser", JSON.stringify(loggedUser));
    if (token) {
      localStorage.setItem("hmsToken", token);
    }

    setUser(loggedUser);

    if (options.stayHome && loggedUser.role === "user") navigate("/");
    else if (loggedUser.role === "superadmin") navigate("/superadmin");
    else if (loggedUser.role === "hospital") navigate("/hospital");
    else if (loggedUser.role === "doctor") navigate("/doctor");
    else navigate("/user");
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("hmsUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("hmsUser");
    localStorage.removeItem("hmsToken");
    setUser(null);
    navigate("/");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              user={user}
              onLogin={loginHandler}
              onLogout={logout}
            />
          }
        />

        <Route path="/superadmin" element={
          <ProtectedRoute user={user}>
            <AdminDashboard user={user} onUserUpdate={updateUser} onLogout={logout} />
          </ProtectedRoute>
        } />

        <Route path="/hospital" element={
          <ProtectedRoute user={user}>
            <HospitalDashboard user={user} onUserUpdate={updateUser} onLogout={logout} />
          </ProtectedRoute>
        } />

        <Route path="/doctor" element={
          <ProtectedRoute user={user}>
            <DoctorDashboard user={user} onUserUpdate={updateUser} onLogout={logout} />
          </ProtectedRoute>
        } />

        <Route path="/user" element={
          <ProtectedRoute user={user}>
            <UserDashboard user={user} onUserUpdate={updateUser} onLogout={logout} />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Suspense>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
