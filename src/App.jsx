import { useState } from "react";
import AdminDashborad from "./components/AdminDashborad";
import HospitalDashboard from "./components/HospitalDashboard";
import HomePage from "./components/HomePage";
import UserDashboard from "./components/UserDashboard";
import "./App.css";

function App() {
  const savedUser = localStorage.getItem("hmsUser");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);

  const logout = () => {
    localStorage.removeItem("hmsToken");
    localStorage.removeItem("hmsUser");
    setUser(null);
  };

  if (!user) {
    return <HomePage onLogin={setUser} />;
  }

  if (user.role === "superadmin") {
    return <AdminDashborad user={user} onUserUpdate={setUser} onLogout={logout} />;
  }

  if (user.role === "hospital") {
    return <HospitalDashboard user={user} onUserUpdate={setUser} onLogout={logout} />;
  }

  return <UserDashboard user={user} onUserUpdate={setUser} onLogout={logout} />;
}

export default App;
