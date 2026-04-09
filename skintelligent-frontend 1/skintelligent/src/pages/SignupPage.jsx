import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useSignupMutation } from "../api/hooks";
import { PageTransition, Reveal } from "../components/Motion";
import { useNotificationEffect } from "../hooks/useNotificationEffect";
import { formatApiError } from "../lib/formatters";
import { colors } from "../styles/tokens";
import * as s from "../styles/shared";

export default function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const signupError = formatApiError(signupMutation.error);
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useNotificationEffect(
    signupError,
    (api, message) => api.error(message, { title: "Sign-up failed" }),
    [signupMutation.error],
  );

  const onSubmit = async (values) => {
    const payload = await signupMutation.mutateAsync(values);
    navigate(payload.user.profile ? "/dashboard" : "/onboarding", { replace: true });
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
          Create your account to get started
        </Reveal>

        <Reveal
          delay={160}
          style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}
        >
          <input
            placeholder="Full name"
            className="motion-input motion-liquid-focus"
            style={s.input}
            {...register("name", { required: true, minLength: 2 })}
          />
          <input
            type="email"
            placeholder="Email address"
            className="motion-input motion-liquid-focus"
            style={s.input}
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="Create password"
            className="motion-input motion-liquid-focus"
            style={s.input}
            {...register("password", { required: true, minLength: 8 })}
          />
        </Reveal>

        <button
          type="submit"
          className="motion-button"
          disabled={signupMutation.isPending || formState.isSubmitting}
          style={{ ...s.btnPrimary, width: "100%", padding: "0.9rem" }}
        >
          {signupMutation.isPending ? "Creating account..." : "Create Account"}
        </button>
        <Reveal as="p" delay={220} style={{ fontSize: "0.82rem", color: colors.lightMid, marginTop: "1.5rem" }}>
          Already have an account?{" "}
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
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </Reveal>
      </form>
    </PageTransition>
  );
}
