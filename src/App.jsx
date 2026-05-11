import { useState } from "react";
import AdminDashborad from "./components/AdminDashborad";
import AuthPage from "./components/AuthPage";
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
    return <AuthPage onLogin={setUser} />;
  }

  if (user.role === "superadmin") {
    return <AdminDashborad user={user} onUserUpdate={setUser} onLogout={logout} />;
  }

  return <UserDashboard user={user} onLogout={logout} />;
}

export default App;
