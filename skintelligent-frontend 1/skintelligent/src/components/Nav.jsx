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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuId = useId();
  const mobileMenuId = useId();
  const menuRef = useRef(null);
  const firstActionRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
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

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const initials = user?.name?.trim()?.[0]?.toUpperCase() || "?";
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Profile";
  const accountItems = [
    {
      label: "Profile",
      meta: "Skin settings",
      href: "/profile",
    },
    {
      label: "Dashboard",
      meta: "Recommendations",
      href: "/dashboard",
    },
    {
      label: "Saved",
      meta: "Shortlisted products",
      href: "/saved",
    },
    {
      label: "Product Lookup",
      meta: "Search catalog",
      href: "/lookup",
    },
  ];

  const closeAllMenus = () => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    closeAllMenus();
    await logoutMutation.mutateAsync();
    navigate("/login");
  };

  const mobileSummaryTitle = user ? firstName : "Skincare, tuned to you";
  const mobileSummaryMeta = user ? "Your account" : "Sign in or start your profile";

  return (
    <>
      <nav className="site-nav" style={s.nav}>
        <div className="site-nav__inner" style={s.navInner}>
          <Link to="/" className="motion-link" style={{ ...s.logo, textDecoration: "none" }}>
            Skin<span style={s.logoAccent}>telligent</span>
          </Link>

          <div className="site-nav__desktop" style={{ display: "flex", alignItems: "center", gap: "2.2rem" }}>
            {user ? (
              <>
                <div className="site-nav__desktop-links" style={{ display: "flex", alignItems: "center", gap: "2.2rem" }}>
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
                </div>

                <div ref={menuRef} className="profile-menu" data-open={menuOpen}>
                  <button
                    type="button"
                    className="motion-avatar profile-trigger"
                    aria-expanded={menuOpen}
                    aria-controls={profileMenuId}
                    aria-label={user?.name ? `${user.name} profile options` : "Open profile options"}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMenuOpen((current) => !current);
                    }}
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
                    <span className="profile-chevron">v</span>
                  </button>

                  <div
                    id={profileMenuId}
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

                    {accountItems.map((item, index) => (
                      <button
                        key={item.label}
                        ref={index === 0 ? firstActionRef : null}
                        type="button"
                        role="menuitem"
                        className="profile-menu-item motion-menu-item"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(item.href);
                        }}
                      >
                        <span className="profile-menu-item-label">
                          <span>{item.label}</span>
                          <span className="profile-menu-item-meta">{item.meta}</span>
                        </span>
                        <span aria-hidden="true">&gt;</span>
                      </button>
                    ))}

                    <div className="profile-divider" />

                    <button
                      type="button"
                      role="menuitem"
                      className="profile-menu-item motion-menu-item"
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      style={{ color: colors.deepRose }}
                    >
                      <span className="profile-menu-item-label">
                        <span>{logoutMutation.isPending ? "Signing out..." : "Log Out"}</span>
                        <span className="profile-menu-item-meta">End current session</span>
                      </span>
                      <span aria-hidden="true">&gt;</span>
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

          <button
            type="button"
            className="site-nav__mobile-toggle motion-button"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => {
              setMenuOpen(false);
              setMobileMenuOpen((current) => !current);
            }}
          >
            {user ? <span className="site-nav__mobile-avatar">{initials}</span> : null}
            <span className="site-nav__mobile-toggle-label">{mobileMenuOpen ? "Close" : "Menu"}</span>
            <span className={`site-nav__mobile-toggle-bars ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      <div
        id={mobileMenuId}
        className="site-nav__mobile-panel"
        aria-hidden={!mobileMenuOpen}
        data-open={mobileMenuOpen}
      >
        <button
          type="button"
          className="site-nav__mobile-overlay"
          tabIndex={mobileMenuOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className="site-nav__mobile-sheet liquid-card motion-liquid-surface"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="site-nav__mobile-summary">
            <div className="site-nav__mobile-summary-copy">
              <div className="site-nav__mobile-summary-title">{mobileSummaryTitle}</div>
              <div className="site-nav__mobile-summary-meta">{mobileSummaryMeta}</div>
            </div>
            {user ? <span className="site-nav__mobile-summary-badge">{initials}</span> : null}
          </div>

          <div className="site-nav__mobile-actions">
            {user ? (
              <>
                {accountItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={({ isActive }) =>
                      `site-nav__mobile-link motion-menu-item ${isActive ? "is-active" : ""}`.trim()
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="site-nav__mobile-link-copy">
                      <span>{item.label}</span>
                      <span className="site-nav__mobile-link-meta">{item.meta}</span>
                    </span>
                    <span aria-hidden="true">&gt;</span>
                  </NavLink>
                ))}

                <button
                  type="button"
                  className="site-nav__mobile-link motion-menu-item site-nav__mobile-link--danger"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <span className="site-nav__mobile-link-copy">
                    <span>{logoutMutation.isPending ? "Signing out..." : "Log Out"}</span>
                    <span className="site-nav__mobile-link-meta">End current session</span>
                  </span>
                  <span aria-hidden="true">&gt;</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `site-nav__mobile-link motion-menu-item ${isActive ? "is-active" : ""}`.trim()
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="site-nav__mobile-link-copy">
                    <span>Sign In</span>
                    <span className="site-nav__mobile-link-meta">Return to your skin profile</span>
                  </span>
                  <span aria-hidden="true">&gt;</span>
                </NavLink>
                <Link
                  to="/signup"
                  className="site-nav__mobile-cta motion-button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
