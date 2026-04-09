import { useNavigate } from "react-router-dom";

import {
  useRemoveSavedProductMutation,
  useSaveProductMutation,
  useSavedProductAnalyses,
  useSavedProductsQuery,
} from "../api/hooks";
import { PageTransition, Reveal, StaggerGroup } from "../components/Motion";
import { SectionHeadingSkeleton } from "../components/PageSkeletons";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";
import { useNotificationEffect } from "../hooks/useNotificationEffect";
import { formatApiError } from "../lib/formatters";
import { useNotifications } from "../providers/NotificationProvider";
import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

const productGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "1.5rem",
};

export default function SavedPage() {
  const navigate = useNavigate();
  const savedProductsQuery = useSavedProductsQuery(true);
  const productIds = (savedProductsQuery.data || []).map((product) => product.product_id);
  const analyses = useSavedProductAnalyses(productIds, productIds.length > 0);
  const saveProductMutation = useSaveProductMutation();
  const removeSavedProductMutation = useRemoveSavedProductMutation();
  const notifications = useNotifications();

  const isAnalysesLoading = analyses.some((query) => query.isLoading && !query.data);
  const analysisError = analyses.find((query) => query.error)?.error;
  const collectionError = formatApiError(savedProductsQuery.error || analysisError);
  const saveError = formatApiError(saveProductMutation.error || removeSavedProductMutation.error);
  const products = analyses
    .map((query) => query.data)
    .filter(Boolean)
    .map((analysis) => ({
      product_id: analysis.product.product_id,
      product_name: analysis.product.product_name,
      brand: analysis.product.brand,
      category: analysis.product.category,
      price: analysis.product.price,
      description: analysis.product.description,
      ingredients: analysis.product.ingredients,
      final_score: analysis.final_score,
      reason_codes: analysis.reason_codes,
      warnings: analysis.warnings,
      worth_the_hype: analysis.worth_the_hype,
      saved: analysis.saved,
    }));
  const savedCount = savedProductsQuery.data?.length || 0;
  const isInitialLoading = (savedProductsQuery.isLoading && !savedProductsQuery.data) || isAnalysesLoading;

  useNotificationEffect(
    collectionError,
    (api, message) => api.error(message, { title: "Couldn't load saved products" }),
    [savedProductsQuery.error, analysisError],
  );
  useNotificationEffect(
    saveError,
    (api, message) => api.error(message, { title: "Couldn't update saved products" }),
    [saveProductMutation.error, removeSavedProductMutation.error],
  );

  const toggleSave = async (product) => {
    if (product.saved) {
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 3rem" }}>
        {isInitialLoading ? (
          <SectionHeadingSkeleton titleWidth="36%" subWidth="28%" />
        ) : (
          <>
            <Reveal as="p" delay={40} style={s.sectionLabel}>
              Your Collection
            </Reveal>
            <Reveal as="h2" delay={100} style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>
              Saved <em style={s.sectionTitleEm}>products</em>
            </Reveal>
            <Reveal as="p" delay={160} style={{ ...s.sectionSub, marginBottom: "2rem" }}>
              {savedCount} products in your shortlist.
            </Reveal>
          </>
        )}

        <div style={{ minHeight: 430 }}>
          {isInitialLoading ? (
            <div style={productGridStyle}>
              <ProductGridSkeleton count={Math.max(savedCount, 3)} />
            </div>
          ) : !products.length ? (
            <Reveal
              className="motion-card motion-liquid-surface motion-empty-float"
              style={{ ...s.card, textAlign: "center", padding: "4rem 2rem", minHeight: 260 }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem", color: colors.deepRose }}>+</div>
              <div style={{ fontFamily: fonts.display, fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                No saved products yet
              </div>
              <p style={{ fontSize: "0.88rem", color: colors.mid, margin: 0 }}>
                Browse your recommendations and save the products worth revisiting.
              </p>
            </Reveal>
          ) : (
            <StaggerGroup style={productGridStyle}>
              {products.map((product, index) => (
                <Reveal key={product.product_id} index={index} variant="bounce">
                  <ProductCard
                    product={product}
                    onOpen={() => navigate(`/products/${product.product_id}`)}
                    onToggleSave={() => toggleSave(product)}
                    isBusy={saveProductMutation.isPending || removeSavedProductMutation.isPending}
                  />
                </Reveal>
              ))}
            </StaggerGroup>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
