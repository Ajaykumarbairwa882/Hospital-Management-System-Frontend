import { useState } from "react";
import { forgotPassword, resetPassword } from "../api/authApi";

function Login({ loading, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const submitForm = (event) => {
    event.preventDefault();
    onLogin(email, password);
  };

  const sendResetToken = async () => {
    try {
      setResetLoading(true);
      setResetMessage("");

      const data = await forgotPassword(resetEmail);

      setResetToken(data.resetToken);
      setResetMessage("Reset token generated. Enter new password and save.");
    } catch (error) {
      setResetMessage(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  const submitResetPassword = async (event) => {
    event.preventDefault();

    try {
      setResetLoading(true);
      setResetMessage("");

      const data = await resetPassword(resetToken, newPassword);

      setResetMessage(data.message);
      setShowReset(false);
      setResetEmail("");
      setResetToken("");
      setNewPassword("");
    } catch (error) {
      setResetMessage(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <form className="authForm" onSubmit={submitForm}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
        />

        <button type="button" className="linkBtn" onClick={() => setShowReset(!showReset)}>
          Forgot password?
        </button>

        <button className="authBtn" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>

      {showReset && (
        <form className="authForm resetBox" onSubmit={submitResetPassword}>
          <label>Registered Email</label>
          <input
            type="email"
            value={resetEmail}
            onChange={(event) => setResetEmail(event.target.value)}
            placeholder="Enter registered email"
          />

          <button type="button" className="authBtn secondaryBtn" onClick={sendResetToken} disabled={resetLoading}>
            {resetLoading ? "Please wait..." : "Get Reset Token"}
          </button>

          <label>Reset Token</label>
          <input
            value={resetToken}
            onChange={(event) => setResetToken(event.target.value)}
            placeholder="Reset token"
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Enter new password"
          />

          {resetMessage && <p className="smallMessage">{resetMessage}</p>}

          <button className="authBtn" disabled={resetLoading}>
            Reset Password
          </button>
        </form>
      )}
    </>
  );
}

export default Login;
