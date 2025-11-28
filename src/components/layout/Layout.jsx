import { Header } from "./Header/Header";
import { Footer } from "./Footer";
import "../layout/Layout.css";

export function Layout({ userName, onLogout, children }) {
  return (
    <div className="app-layout">
      <Header userName={userName} onLogout={onLogout} />
      <main className="app-layout__main">{children}</main>
      <Footer></Footer>
    </div>
  );
}
