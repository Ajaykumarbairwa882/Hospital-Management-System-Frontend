function UserDashboard({ user, onLogout }) {
  return (
    <div className="userDashboard">
      <nav className="navbar">
        <div>
          <h1>User Dashboard</h1>
          <p>Welcome to Hospital Management System</p>
        </div>

        <div className="navRight">
          <button className="logoutBtn" onClick={onLogout}>
            Logout
          </button>

          <div className="profile">
            <div className="avatar">{user.name?.slice(0, 2).toUpperCase() || "US"}</div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="userContent">
        <section className="locationArea">
          <h2>Dashboard</h2>
          <p className="mutedText">You are logged in as {user.role}.</p>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
