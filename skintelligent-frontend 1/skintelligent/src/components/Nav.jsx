import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useLogoutMutation } from "../api/hooks";
import { useAuth } from "../providers/AuthProvider";
import { colors } from "../styles/tokens";
import * as s from "../styles/shared";

function navLinkStyle({ isActive }) {
  return {
    ...s.navLink,
    color: isActive ? colors.deepRose : s.navLink.color,
    opacity: isActive ? 1 : 0.8,
  };
}

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const logoutMutation = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef(null);
  const firstActionRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    firstActionRef.current?.focus();

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const initials = user?.name?.trim()?.[0]?.toUpperCase() || "?";
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Profile";
  const menuItems = [
    {
      label: "Profile",
      meta: "Skin settings",
      action: () => navigate("/profile"),
    },
    {
      label: "Dashboard",
      meta: "Recommendations",
      action: () => navigate("/dashboard"),
    },
    {
      label: "Saved",
      meta: "Shortlisted products",
      action: () => navigate("/saved"),
    },
    {
      label: "Product Lookup",
      meta: "Search catalog",
      action: () => navigate("/lookup"),
    },
  ];

  return (
    <nav style={s.nav}>
      <Link to="/" className="motion-link" style={{ ...s.logo, textDecoration: "none" }}>
        Skin<span style={s.logoAccent}>telligent</span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "2.2rem" }}>
        {user ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `motion-link ${isActive ? "nav-link-active" : ""}`}
              style={navLinkStyle}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/lookup"
              className={({ isActive }) => `motion-link ${isActive ? "nav-link-active" : ""}`}
              style={navLinkStyle}
            >
              Product Lookup
            </NavLink>
            <NavLink
              to="/saved"
              className={({ isActive }) => `motion-link ${isActive ? "nav-link-active" : ""}`}
              style={navLinkStyle}
            >
              Saved
            </NavLink>

            <div ref={menuRef} className="profile-menu" data-open={menuOpen}>
              <button
                type="button"
                className="motion-avatar profile-trigger"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                aria-label={user?.name ? `${user.name} profile options` : "Open profile options"}
                onClick={() => setMenuOpen((current) => !current)}
                style={{
                  border: `1px solid ${colors.border}`,
                  background: "rgba(255,250,246,0.76)",
                  borderRadius: "999px",
                  padding: "0.28rem 0.36rem 0.28rem 0.3rem",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.blush}, ${colors.sage})`,
                    display: "grid",
                    placeItems: "center",
                    fontSize: "0.92rem",
                    color: colors.charcoal,
                  }}
                >
                  {initials}
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingRight: "0.25rem",
                    color: colors.charcoal,
                  }}
                >
                  <span style={{ fontSize: "0.82rem", fontWeight: 500, lineHeight: 1.1 }}>{firstName}</span>
                  <span
                    style={{
                      fontSize: "0.63rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: colors.lightMid,
                    }}
                  >
                    Account
                  </span>
                </span>
                <span className="profile-chevron">▼</span>
              </button>

              <div
                id={menuId}
                aria-hidden={!menuOpen}
                className="profile-panel liquid-card motion-menu"
              >
                <div style={{ padding: "0.35rem 0.95rem 0.85rem" }}>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: colors.lightMid,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Signed in
                  </div>
                  <div style={{ color: colors.charcoal, fontWeight: 500 }}>{user.name}</div>
                </div>

                {menuItems.map((item, index) => (
                  <button
                    key={item.label}
                    ref={index === 0 ? firstActionRef : null}
                    type="button"
                    role="menuitem"
                    className="profile-menu-item motion-menu-item"
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={() => {
                      setMenuOpen(false);
                      item.action();
                    }}
                  >
                    <span className="profile-menu-item-label">
                      <span>{item.label}</span>
                      <span className="profile-menu-item-meta">{item.meta}</span>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}

                <div className="profile-divider" />

                <button
                  type="button"
                  role="menuitem"
                  className="profile-menu-item motion-menu-item"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={async () => {
                    setMenuOpen(false);
                    await logoutMutation.mutateAsync();
                    navigate("/login");
                  }}
                  disabled={logoutMutation.isPending}
                  style={{ color: colors.deepRose }}
                >
                  <span className="profile-menu-item-label">
                    <span>{logoutMutation.isPending ? "Signing out..." : "Log Out"}</span>
                    <span className="profile-menu-item-meta">End current session</span>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => `motion-link ${isActive ? "nav-link-active" : ""}`}
              style={navLinkStyle}
            >
              Sign In
            </NavLink>
            <Link to="/signup" className="motion-button" style={{ ...s.navCta, textDecoration: "none" }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
