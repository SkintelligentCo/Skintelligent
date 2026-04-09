import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useGenerateRecommendationsMutation, useUpsertProfileMutation } from "../api/hooks";
import ChipSelect from "../components/ChipSelect";
import { PageTransition, Reveal } from "../components/Motion";
import { useNotificationEffect } from "../hooks/useNotificationEffect";
import {
  budgetOptions,
  concernOptions,
  defaultProfileValues,
  ingredientAvoidOptions,
  ingredientPreferenceOptions,
  productTypeOptions,
  routineOptions,
  sensitivityOptions,
  skinTypeOptions,
} from "../lib/profileOptions";
import { formatApiError } from "../lib/formatters";
import { useNotifications } from "../providers/NotificationProvider";
import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

const steps = [
  {
    title: "What is your skin type?",
    subtitle: "This sets the baseline for personalized ranking.",
  },
  {
    title: "What are your top concerns?",
    subtitle: "Choose the outcomes you want the product ranking to optimize for.",
  },
  {
    title: "Ingredients and sensitivities",
    subtitle: "Tell us what your skin likes and what should be avoided.",
  },
  {
    title: "Routine and budget",
    subtitle: "Set the final guardrails for how recommendations are ranked.",
  },
];

function FieldBlock({ label, children }) {
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ fontFamily: fonts.display, fontSize: "1rem" }}>{label}</div>
      {children}
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const upsertProfileMutation = useUpsertProfileMutation();
  const generateRecommendationsMutation = useGenerateRecommendationsMutation();
  const notifications = useNotifications();
  const { watch, setValue, handleSubmit } = useForm({
    defaultValues: defaultProfileValues,
  });

  const values = watch();
  const isLastStep = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;
  const onboardingError = formatApiError(upsertProfileMutation.error || generateRecommendationsMutation.error);

  useNotificationEffect(
    onboardingError,
    (api, message) => api.error(message, { title: "Couldn't finish onboarding" }),
    [upsertProfileMutation.error, generateRecommendationsMutation.error],
  );

  const stepContent = useMemo(() => {
    if (step === 0) {
      return (
        <FieldBlock label="Skin Type">
          <ChipSelect
            items={skinTypeOptions}
            selected={values.skin_type}
            onChange={(value) => setValue("skin_type", value, { shouldDirty: true })}
            multi={false}
          />
        </FieldBlock>
      );
    }

    if (step === 1) {
      return (
        <FieldBlock label="Top Concerns">
          <ChipSelect
            items={concernOptions}
            selected={values.skin_concerns}
            onChange={(nextValues) => setValue("skin_concerns", nextValues, { shouldDirty: true })}
          />
        </FieldBlock>
      );
    }

    if (step === 2) {
      return (
        <>
          <FieldBlock label="Ingredients You Love">
            <ChipSelect
              items={ingredientPreferenceOptions}
              selected={values.ingredient_preferences}
              onChange={(nextValues) =>
                setValue("ingredient_preferences", nextValues, { shouldDirty: true })
              }
            />
          </FieldBlock>
          <FieldBlock label="Ingredients to Avoid">
            <ChipSelect
              items={ingredientAvoidOptions}
              selected={values.ingredient_avoid}
              onChange={(nextValues) => setValue("ingredient_avoid", nextValues, { shouldDirty: true })}
            />
          </FieldBlock>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <button
              type="button"
              className="motion-chip"
              style={s.chip(values.acne_prone)}
              onClick={() => setValue("acne_prone", !values.acne_prone, { shouldDirty: true })}
            >
              {values.acne_prone ? "Selected: " : ""}Acne-prone
            </button>
            <button
              type="button"
              className="motion-chip"
              style={s.chip(values.fragrance_allergy)}
              onClick={() =>
                setValue("fragrance_allergy", !values.fragrance_allergy, { shouldDirty: true })
              }
            >
              {values.fragrance_allergy ? "Selected: " : ""}Fragrance allergy
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <FieldBlock label="Skin Sensitivity">
          <ChipSelect
            items={sensitivityOptions}
            selected={values.skin_sensitivity}
            onChange={(value) => setValue("skin_sensitivity", value, { shouldDirty: true })}
            multi={false}
          />
        </FieldBlock>
        <FieldBlock label="Budget Range">
          <ChipSelect
            items={budgetOptions}
            selected={values.budget_range}
            onChange={(value) => setValue("budget_range", value, { shouldDirty: true })}
            multi={false}
          />
        </FieldBlock>
        <FieldBlock label="Routine Level">
          <ChipSelect
            items={routineOptions}
            selected={values.routine_level}
            onChange={(value) => setValue("routine_level", value, { shouldDirty: true })}
            multi={false}
          />
        </FieldBlock>
        <FieldBlock label="Preferred Product Types">
          <ChipSelect
            items={productTypeOptions}
            selected={values.preferred_product_types}
            onChange={(nextValues) =>
              setValue("preferred_product_types", nextValues, { shouldDirty: true })
            }
          />
        </FieldBlock>
      </>
    );
  }, [setValue, step, values]);

  const onSubmit = async () => {
    await upsertProfileMutation.mutateAsync(values);
    await generateRecommendationsMutation.mutateAsync({ limit: 6 });
    notifications.success("Your profile is ready and recommendations are live.", {
      title: "Welcome to Skintelligent",
      duration: 3400,
    });
    navigate("/dashboard", { replace: true });
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
      <div style={{ width: "100%", maxWidth: 680 }}>
        <Reveal
          delay={40}
          style={{
            height: 7,
            background: colors.border,
            borderRadius: 100,
            marginBottom: "2.5rem",
            overflow: "hidden",
          }}
        >
          <div
            className="motion-progress-fill progress-sheen"
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${colors.terracotta}, ${colors.deepRose}, ${colors.blush})`,
              borderRadius: 100,
            }}
          />
        </Reveal>

        <Reveal className="motion-card motion-liquid-surface" style={s.card} variant="liquid">
          <p style={s.sectionLabel}>Step {step + 1} of 4</p>
          <h2 style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>{steps[step].title}</h2>
          <p style={s.sectionSub}>{steps[step].subtitle}</p>

          <Reveal key={step} delay={80} variant="bounce">
            {stepContent}
          </Reveal>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {step > 0 ? (
              <button
                type="button"
                className="motion-button"
                style={s.btnGhost}
                onClick={() => setStep((current) => current - 1)}
              >
                Back
              </button>
            ) : null}
            {isLastStep ? (
              <button
                type="button"
                className="motion-button"
                style={s.btnPrimary}
                onClick={handleSubmit(onSubmit)}
                disabled={upsertProfileMutation.isPending || generateRecommendationsMutation.isPending}
              >
                {upsertProfileMutation.isPending || generateRecommendationsMutation.isPending
                  ? "Saving profile..."
                  : "Save profile"}
              </button>
            ) : (
              <button
                type="button"
                className="motion-button"
                style={s.btnPrimary}
                onClick={() => setStep((current) => current + 1)}
              >
                Continue
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
