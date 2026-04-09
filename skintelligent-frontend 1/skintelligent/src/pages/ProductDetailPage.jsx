import { useNavigate, useParams } from "react-router-dom";

import {
  useProductAnalysisQuery,
  useRemoveSavedProductMutation,
  useSaveProductMutation,
} from "../api/hooks";
import FitScoreRing from "../components/FitScoreRing";
import { PageTransition, Reveal, StaggerGroup } from "../components/Motion";
import { ProductDetailSkeleton } from "../components/PageSkeletons";
import ScoreBar from "../components/ScoreBar";
import StatusMessage from "../components/StatusMessage";
import Tag from "../components/Tag";
import { useNotificationEffect } from "../hooks/useNotificationEffect";
import { formatApiError } from "../lib/formatters";
import { useNotifications } from "../providers/NotificationProvider";
import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const analysisQuery = useProductAnalysisQuery(Number(productId), Boolean(productId));
  const saveProductMutation = useSaveProductMutation();
  const removeSavedProductMutation = useRemoveSavedProductMutation();
  const notifications = useNotifications();
  const saveError = formatApiError(saveProductMutation.error || removeSavedProductMutation.error);
  const isInitialLoading = analysisQuery.isLoading && !analysisQuery.data;

  useNotificationEffect(
    saveError,
    (api, message) => api.error(message, { title: "Couldn't update saved products" }),
    [saveProductMutation.error, removeSavedProductMutation.error],
  );

  if (!isInitialLoading && (analysisQuery.error || !analysisQuery.data)) {
    return (
      <div className="page-shell page-shell--ambient" style={{ ...s.page, paddingTop: "6rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 3rem" }}>
          <StatusMessage>{formatApiError(analysisQuery.error, "Product not found.")}</StatusMessage>
          <button
            type="button"
            className="motion-button"
            style={{ ...s.btnGhost, marginTop: "1rem" }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const analysis = analysisQuery.data;
  const product = analysis?.product;

  const toggleSave = async () => {
    if (analysis.saved) {
      await removeSavedProductMutation.mutateAsync(product.product_id);
      notifications.info(`${product.product_name} removed from saved.`, {
        title: "Removed from saved",
        duration: 2800,
      });
      return;
    }
    await saveProductMutation.mutateAsync(product.product_id);
    notifications.success(`${product.product_name} added to your saved list.`, {
      title: "Saved product",
      duration: 2800,
    });
  };

  return (
    <PageTransition style={{ ...s.page, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 3rem" }}>
        {isInitialLoading ? (
          <ProductDetailSkeleton />
        ) : (
          <Reveal className="motion-card motion-liquid-surface" style={s.card} variant="liquid">
            <button
              type="button"
              className="motion-link"
              style={{ ...s.navLink, marginBottom: "1rem" }}
              onClick={() => navigate(-1)}
            >
              Back
            </button>

            <Reveal delay={60} style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: colors.lightMid,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.25rem",
                }}
              >
                {product.brand} / {product.category} / ${Math.round(product.price)}
              </div>
              <h3 style={{ fontFamily: fonts.display, fontSize: "1.6rem", color: colors.charcoal, margin: 0 }}>
                {product.product_name}
              </h3>
            </Reveal>

            <StaggerGroup style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <Tag variant="moss" motionIndex={0}>
                {product.worth_the_hype_label}
              </Tag>
              <Tag variant="terra" motionIndex={1}>
                {Math.round(product.popularity_score * 100)} popularity
              </Tag>
              <Tag variant="blush" motionIndex={2}>
                {Math.round(product.irritation_risk * 100)} irritation risk
              </Tag>
            </StaggerGroup>

            <Reveal
              delay={110}
              className="motion-liquid-surface"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
                padding: "1.2rem",
                borderRadius: "16px",
                background: "rgba(74,92,69,0.05)",
                marginBottom: "1.5rem",
              }}
            >
              <FitScoreRing score={analysis.final_score * 100} size={64} />
              <div>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: "1rem",
                    color: colors.charcoal,
                    marginBottom: "0.25rem",
                  }}
                >
                  Your Fit Score
                </div>
                <div style={{ fontSize: "0.82rem", color: colors.mid }}>{analysis.summary}</div>
              </div>
            </Reveal>

            <StaggerGroup style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1.5rem" }}>
              {analysis.reason_codes.map((reason, index) => (
                <Reveal
                  key={reason}
                  index={index}
                  variant="reveal"
                  style={{
                    padding: "0.55rem 0.85rem",
                    borderRadius: "10px",
                    background: "rgba(74,92,69,0.06)",
                    fontSize: "0.8rem",
                    color: colors.moss,
                  }}
                >
                  + {reason}
                </Reveal>
              ))}
              {analysis.warnings.map((warning, index) => (
                <Reveal
                  key={warning}
                  index={index + analysis.reason_codes.length}
                  variant="reveal"
                  style={{
                    padding: "0.55rem 0.85rem",
                    borderRadius: "10px",
                    background: "rgba(196,120,88,0.07)",
                    fontSize: "0.8rem",
                    color: colors.terracotta,
                  }}
                >
                  ! {warning}
                </Reveal>
              ))}
            </StaggerGroup>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.5rem" }}>
              {product.ingredients.map((ingredient, index) => (
                <Tag key={ingredient} variant="moss" motionIndex={index}>
                  {ingredient}
                </Tag>
              ))}
            </div>

            <Reveal delay={180} style={{ marginBottom: "1.5rem" }}>
              <ScoreBar label="Ingredient Match" value={Math.round(analysis.score_breakdown.ingredient_match * 100)} />
              <ScoreBar label="Skin Type Match" value={Math.round(analysis.score_breakdown.skin_type_match * 100)} />
              <ScoreBar label="Review Sentiment" value={Math.round(analysis.score_breakdown.review_sentiment * 100)} />
              <ScoreBar label="Popularity" value={Math.round(analysis.score_breakdown.popularity * 100)} />
              <ScoreBar label="Worth the Hype" value={Math.round(analysis.score_breakdown.worth_the_hype * 100)} />
            </Reveal>

            <Reveal
              delay={220}
              className="motion-liquid-surface"
              style={{
                marginTop: "1.2rem",
                padding: "0.9rem",
                background: "rgba(74,92,69,0.07)",
                borderRadius: "12px",
                fontSize: "0.8rem",
                color: colors.moss,
                lineHeight: 1.6,
              }}
            >
              <strong>Ingredient fit:</strong> {analysis.ingredient_match_explanation}
              <br />
              <strong>Sentiment:</strong> {analysis.sentiment_summary}
              <br />
              <strong>Skin type insight:</strong> {analysis.skin_type_insight}
            </Reveal>

            <button
              type="button"
              className="motion-button"
              style={{ ...s.btnPrimary, width: "100%", marginTop: "1.5rem", textAlign: "center" }}
              onClick={toggleSave}
              disabled={saveProductMutation.isPending || removeSavedProductMutation.isPending}
            >
              {analysis.saved ? "Remove from Saved" : "Save Product"}
            </button>
          </Reveal>
        )}
      </div>
    </PageTransition>
  );
}
