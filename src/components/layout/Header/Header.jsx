import "./Header.css";

export function Header({ userName, userSubtitle, onLogout }) {
  return (
    <header className="header">
      <div className="header__inner">
        <a href="/" className="header__brand">
          <span className="header__logo">
            <span className="header__logo-text">Olejra</span>
          </span>
        </a>

        <div className="header__user">
          {userName && <span className="header__user-name">{userName}</span>}
          {userSubtitle && <span className="header__user-tag">{userSubtitle}</span>}
        </div>

        <button className="header__logout-btn" onClick={onLogout} aria-label="Exit from account" title="Logout">
          Exit
        </button>
      </div>
    </header>
  );
}
