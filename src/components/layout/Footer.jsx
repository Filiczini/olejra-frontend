import { Container } from "./Container";
import "./Footer.css";

import { Github, GitBranch } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  // Vite exposes current mode here
  const envMode = import.meta.env.MODE; // "development" | "production"
  // Later we can move version to env variable if needed
  const appVersion = "v0.1.0";

  return (
    <footer className="olejra-footer">
      <Container>
        <div className="olejra-footer__inner">
          <div className="olejra-footer__left">
            <span className="olejra-footer__title">Olejra Board</span>
            <span className="olejra-footer__subtitle">© {year} Olejra Inc. All rights reserved.</span>
          </div>

          <div className="olejra-footer__right">
            <div className="olejra-footer__status">
              <span className="olejra-footer__status-label">Status:</span>
              <span className="env-badge">System normal</span>
              <span className="env-badge">{appVersion}</span>
              <span className="env-badge">ENV: {envMode}</span>
            </div>

            <span className="olejra-footer__separator" />

            <a href="https://github.com/Filiczini/" target="_blank" rel="noreferrer" className="footer__link">
              <Github size={16} />
              GitHub
            </a>
            <a href="https://github.com/Filiczini/olejra-frontend/pulls" target="_blank" rel="noreferrer" className="footer__link">
              <GitBranch size={16} />
              Changelog
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
