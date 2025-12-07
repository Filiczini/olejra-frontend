import "./Header.css";
import { Container } from "../Container";
import { LogOut } from "lucide-react";

export function Header({ userName, userSubtitle, onLogout }) {
  return (
    <header className="header">
      <Container className="header__inner">
        <a href="/" className="header__brand">
          <span className="header__logo-dot"></span>
          <span className="header__logo-text">OLEJRA</span>
        </a>

        <div className="header__actions">
          <button className="header__action-btn" onClick={onLogout} aria-label="Exit from account">
            <LogOut size={18} className="header__icon" />
            <span>Exit</span>
          </button>
        </div>
      </Container>
    </header>
  );
}
