import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCallback, useRef } from "react";
import { ADMIN_GATE_KEY } from "../constants";
import { useSiteSettings } from "../context/ProductsContext";
import styles from "./Layout.module.css";
const CLICK_WINDOW_MS = 2800;

export function Layout() {
  const navigate = useNavigate();
  const { site } = useSiteSettings();
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetClicks = useCallback(() => {
    clicks.current = 0;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const onLogoClick = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    clicks.current += 1;
    timer.current = setTimeout(resetClicks, CLICK_WINDOW_MS);

    if (clicks.current >= 4) {
      resetClicks();
      sessionStorage.setItem(ADMIN_GATE_KEY, "1");
      navigate("/admin");
    }
  }, [navigate, resetClicks]);

  return (
    <div className={styles.shell}>
      <div className={styles.bg} aria-hidden />
      <header className={styles.header}>
        <button type="button" className={styles.logoBtn} onClick={onLogoClick}>
          {site.logoUrl?.trim() ? (
            <img
              className={styles.logoImg}
              src={site.logoUrl}
              alt={site.logoAlt || site.brandName}
              loading="eager"
            />
          ) : (
            <span className={styles.logoMark} />
          )}
          <span className={styles.logoText}>
            <span className={styles.logoMain}>{site.brandName}</span>
            <span className={styles.logoSub}>{site.brandTagline}</span>
          </span>
        </button>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navActive : ""}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navActive : ""}`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navActive : ""}`
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/terms"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navActive : ""}`
            }
          >
            Terms
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerNote}>
          {site.footerNote}
        </p>
        <p className={styles.footerLegal}>
          © {new Date().getFullYear()} {site.brandName} ·{" "}
          <NavLink to="/contact">Contact</NavLink> · <NavLink to="/terms">Terms</NavLink>
        </p>
      </footer>
    </div>
  );
}
