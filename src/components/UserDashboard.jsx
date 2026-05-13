import { useState } from "react";
import Navbar from "./Navbar";
import UserProfile from "./UserProfile";

function UserDashboard({ user, onUserUpdate, onLogout }) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  return (
    <div className="userDashboard">
      <Navbar
        title="User Dashboard"
        subtitle="Welcome to Hospital Management System"
        user={user}
        onLogout={onLogout}
        onOpenProfile={() => setShowProfilePopup(true)}
      />

      <main className="userContent">
        <section className="locationArea">
          <h2>Dashboard</h2>
          <p className="mutedText">You are logged in as {user.role}.</p>
        </section>
      </main>

      {showProfilePopup && (
        <div className="popupBg">
          <div className="popup profilePopup">
            <UserProfile
              user={user}
              title="User Profile"
              onUserUpdate={onUserUpdate}
              onClose={() => setShowProfilePopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
