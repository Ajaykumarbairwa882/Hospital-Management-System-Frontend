function AdminNavbar({ user, darkMode, onToggleMode, onLogout, onOpenProfile }) {
  return (
    <nav className="navbar">
      <div>
        <h1>Super Admin Dashboard</h1>
        <p>Hospital location setup</p>
      </div>

      <div className="navRight">
        <button className="modeBtn" onClick={onToggleMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button className="logoutBtn" onClick={onLogout}>
          Logout
        </button>

          <button className="profile profileButton" onClick={onOpenProfile}>
            <div className="avatar">{user?.name?.slice(0, 2).toUpperCase() || "SA"}</div>
            <div>
              <strong>{user?.name || "Super Admin"}</strong>
              <span>{user?.email || "admin@hms.com"}</span>
            </div>
          </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
