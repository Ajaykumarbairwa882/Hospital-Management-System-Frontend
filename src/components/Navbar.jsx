import useTheme from "../hooks/useTheme";

function Navbar({
  title,
  subtitle,
  user,
  actions = [],
  onLogout,
  onOpenProfile,
  onTitleClick,
}) {
  const { modeText, toggleTheme } = useTheme();
  const initials = user?.name?.slice(0, 2).toUpperCase() || "US";

  return (
    <nav className="navbar">
      <div>
        {onTitleClick ? (
          <button className="brandBtn" onClick={onTitleClick}>
            {title}
          </button>
        ) : (
          <h1>{title}</h1>
        )}
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="navRight">
        {actions.map((action) => (
          <button
            className="navBtn"
            key={action.label}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}

        <button className="modeBtn" onClick={toggleTheme}>
          {modeText}
        </button>

        {onLogout && (
          <button className="logoutBtn" onClick={onLogout}>
            Logout
          </button>
        )}

        {user && (
          <button
            className={
              onOpenProfile ? "profile profileButton" : "profile staticProfile"
            }
            onClick={onOpenProfile}
            type="button"
          >
            <div className="avatar">{initials}</div>
            <div>
              <strong>{user.name || "User"}</strong>
              <span>{user.email || "user@hms.com"}</span>
            </div>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
