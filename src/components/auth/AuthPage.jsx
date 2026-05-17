import { useState } from "react";
import { loginUser, signupUser } from "../../api/authApi";
import Login from "./Login";
import Signup from "./Signup";

function AuthPage({ onLogin }) {
  const [screen, setScreen] = useState("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const saveSession = (data) => {
    if (data.token) {
      localStorage.setItem("hmsToken", data.token);
    }

    localStorage.setItem("hmsUser", JSON.stringify(data.user));
    onLogin(data.user);
  };

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setMessage("");

      const data = await loginUser(email, password);

      saveSession(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    try {
      setLoading(true);
      setMessage("");

      const data = await signupUser(formData);

      saveSession(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authBox">
        <div className="authHead">
          <h1>Hospital Management System</h1>
          <p>{screen === "login" ? "Login to continue" : "Create your account"}</p>
        </div>

        <div className="authTabs">
          <button className={screen === "login" ? "selected" : ""} onClick={() => setScreen("login")}>
            Login
          </button>
          <button className={screen === "signup" ? "selected" : ""} onClick={() => setScreen("signup")}>
            Signup
          </button>
        </div>

        {message && <p className="errorText">{message}</p>}

        {screen === "login" ? (
          <Login loading={loading} onLogin={handleLogin} />
        ) : (
          <Signup loading={loading} onSignup={handleSignup} />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
