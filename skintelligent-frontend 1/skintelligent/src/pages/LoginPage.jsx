import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useLoginMutation } from "../api/hooks";
import { PageTransition, Reveal } from "../components/Motion";
import { useNotificationEffect } from "../hooks/useNotificationEffect";
import { formatApiError } from "../lib/formatters";
import { colors } from "../styles/tokens";
import * as s from "../styles/shared";

function getLoginError(error) {
  if (!error) {
    return "";
  }
  if (error.status === 401) {
    return "Invalid email or password.";
  }
  if (error.status === 429) {
    return "Too many sign-in attempts. Try again later.";
  }
  return formatApiError(error);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();
  const loginError = getLoginError(loginMutation.error);
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useNotificationEffect(
    loginError,
    (api, message) => api.error(message, { title: "Sign-in failed" }),
    [loginMutation.error],
  );

  const onSubmit = async (values) => {
    const payload = await loginMutation.mutateAsync(values);
    const nextRoute = payload.user.profile ? location.state?.from || "/dashboard" : "/onboarding";
    navigate(nextRoute, { replace: true });
  };

  return (
    <PageTransition
      style={{
        ...s.page,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="motion-card motion-liquid-surface"
        style={{ ...s.card, width: "100%", maxWidth: 420, textAlign: "center" }}
      >
        <Reveal as="div" delay={40} style={{ ...s.logo, marginBottom: "0.5rem" }}>
          Skin<span style={s.logoAccent}>telligent</span>
        </Reveal>
        <Reveal as="p" delay={100} style={{ fontSize: "0.85rem", color: colors.mid, marginBottom: "2rem" }}>
          Sign in to your skin profile
        </Reveal>

        <Reveal
          delay={160}
          style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}
        >
          <input
            type="email"
            placeholder="Email address"
            className="motion-input motion-liquid-focus"
            style={s.input}
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="Password"
            className="motion-input motion-liquid-focus"
            style={s.input}
            {...register("password", { required: true, minLength: 8 })}
          />
        </Reveal>

        <button
          type="submit"
          className="motion-button"
          disabled={loginMutation.isPending || formState.isSubmitting}
          style={{ ...s.btnPrimary, width: "100%", padding: "0.9rem" }}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </button>
        <Reveal as="p" delay={220} style={{ fontSize: "0.82rem", color: colors.lightMid, marginTop: "1.5rem" }}>
          New here?{" "}
          <button
            type="button"
            className="motion-link"
            style={{
              background: "none",
              border: "none",
              color: colors.deepRose,
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
            onClick={() => navigate("/signup")}
          >
            Create an account
          </button>
        </Reveal>
      </form>
    </PageTransition>
  );
}
