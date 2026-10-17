interface Props {
  page: string;
  onNavigate: (page: string) => void;
  userName: string;
  onLogout: () => void;
}

export default function Navbar({
  page,
  onNavigate,
  userName,
  onLogout,
}: Props) {
  const links = ["home", "dashboard", "history", "alerts", "sensors"];

  return (
    <header className="navbar">
      <button className="brand" type="button" onClick={() => onNavigate("home")}>
        <span className="brand-mark">🌱</span>
        <span>
          <strong>AgroSense</strong>
          <small>Smart Greenhouse</small>
        </span>
      </button>

      <nav className="nav-links" aria-label="Main navigation">
        {links.map((link) => (
          <button
            className={page === link ? "active" : ""}
            key={link}
            type="button"
            onClick={() => onNavigate(link)}
          >
            {link[0].toUpperCase() + link.slice(1)}
          </button>
        ))}
      </nav>

      <div className="user-area">
        <span>Hi, {userName}</span>
        <button className="logout-btn" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
