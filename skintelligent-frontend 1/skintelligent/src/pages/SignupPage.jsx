import { colors } from "../styles/tokens";
import * as s from "../styles/shared";

export default function SignupPage({ setPage }) {
  return (
    <div style={{
      ...s.page, display: "flex", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "2rem",
    }}>
      <div style={{ ...s.card, width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div style={{ ...s.logo, marginBottom: "0.5rem" }}>
          Skin<span style={s.logoAccent}>telligent</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: colors.mid, marginBottom: "2rem" }}>
          Create your account to get started
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}>
          <input placeholder="Full name" style={s.input} />
          <input type="email" placeholder="Email address" style={s.input} />
          <input type="password" placeholder="Create password" style={s.input} />
        </div>

        <button style={{ ...s.btnPrimary, width: "100%", padding: "0.9rem" }}>
          Create Account
        </button>

        <p style={{ fontSize: "0.82rem", color: colors.lightMid, marginTop: "1.5rem" }}>
          Already have an account?{" "}
          <span
            style={{ color: colors.deepRose, cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setPage("login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
