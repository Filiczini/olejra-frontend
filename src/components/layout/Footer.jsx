import "./Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  // Vite exposes current mode here
  const envMode = import.meta.env.MODE; // "development" | "production"

  return (
    <footer className="olejra-footer">
      <div className="olejra-footer__left">
        <span>© {year} Olejra</span>
        <span className="olejra-footer__separator">•</span>
        <span>ENV: {envMode}</span>
      </div>

      <div className="olejra-footer__right">
        <a href="https://github.com/Filiczini/" target="_blank" rel="noreferrer" className="olejra-footer__link">
          GitHub ↗
        </a>
      </div>
    </footer>
  );
}
