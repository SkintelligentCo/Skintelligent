import { colors } from "../styles/tokens";
import * as s from "../styles/shared";

export default function Nav({ setPage, user }) {
  return (
    <nav style={s.nav}>
      <div style={s.logo} onClick={() => setPage("landing")}>
        Skin<span style={s.logoAccent}>telligent</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "2.2rem" }}>
        {user ? (
          <>
            <button style={s.navLink} onClick={() => setPage("dashboard")}>Dashboard</button>
            <button style={s.navLink} onClick={() => setPage("lookup")}>Product Lookup</button>
            <button style={s.navLink} onClick={() => setPage("saved")}>Saved</button>
            <button style={s.navLink} onClick={() => setPage("profile")}>Profile</button>
            <div
              onClick={() => setPage("profile")}
              style={{
                width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
                background: `linear-gradient(135deg, ${colors.blush}, ${colors.sage})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem",
              }}
            >
              {user.name?.[0] || "?"}
            </div>
          </>
        ) : (
          <>
            <button style={s.navLink} onClick={() => setPage("login")}>Sign In</button>
            <button style={s.navCta} onClick={() => setPage("signup")}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
}
