"""
Skintelligent Recommendation Engine
=====================================
Production-ready module extracted from Skintelligent_Recommendation.ipynb.

Usage:
    from recommender import SkintelligentRecommender
    rec = SkintelligentRecommender(db_url=os.getenv("SKINTELLIGENT_DATABASE_URL"))
    results = rec.recommend(user_profile, user_id=42, top_n=10)

Database connection:
    Set SKINTELLIGENT_DATABASE_URL in your .env file.
    Local:  mysql+pymysql://root:password@localhost:3306/skintelligent
    Cloud:  mysql+pymysql://user:password@hosted-db-url.com:3306/skintelligent
    (swap the URL in .env — no code changes needed)
"""

import os
import logging
import warnings

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("skintelligent")

load_dotenv()


# ═══════════════════════════════════════════════════════════════════════════════
# Data Loading
# ═══════════════════════════════════════════════════════════════════════════════

def load_data(db_url: str | None = None, csv_path: str | None = None) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Load reviews+products and ingredient_risk data.

    Priority:
        1. Live MySQL database (db_url or SKINTELLIGENT_DATABASE_URL env var)
        2. Local CSV files (csv_path prefix, e.g. '../data/')

    Returns:
        full_data         — merged reviews × products DataFrame
        ingredient_risk   — ingredient risk table DataFrame
    """
    db_url = db_url or os.getenv("SKINTELLIGENT_DATABASE_URL")

    if db_url:
        log.info("Connecting to database …")
        try:
            engine = create_engine(db_url, pool_pre_ping=True)
            with engine.connect() as conn:
                full_data       = pd.read_sql("SELECT * FROM reviews_all_products", conn)
                ingredient_risk = pd.read_sql("SELECT * FROM ingredient_risk",      conn)
            log.info(f"✓ Loaded {len(full_data):,} reviews from database.")
            return full_data, ingredient_risk
        except Exception as exc:
            log.error(f"Database connection failed: {exc}")
            log.warning("Falling back to CSV files if csv_path is set …")

    if csv_path:
        log.info(f"Loading CSVs from {csv_path} …")
        warnings.filterwarnings("ignore", category=pd.errors.DtypeWarning)
        full_data       = pd.read_csv(f"{csv_path}reviews_all_products.csv", low_memory=False)
        ingredient_risk = pd.read_csv(f"{csv_path}ingredient_risk_table.csv")
        log.info(f"✓ Loaded {len(full_data):,} reviews from CSV.")
        return full_data, ingredient_risk

    raise ValueError(
        "No data source provided. Set SKINTELLIGENT_DATABASE_URL or pass csv_path."
    )


# ═══════════════════════════════════════════════════════════════════════════════
# Feature Engineering
# ═══════════════════════════════════════════════════════════════════════════════

def engineer_features(full_data: pd.DataFrame) -> pd.DataFrame:
    """Add helpfulness-weighted rating and return a cleaned copy."""
    df = full_data.copy()

    # Rename legacy column names if present
    for old, new in [("rating_x", "review_rating"), ("rating_y", "product_rating"),
                     ("price_usd_x", "review_price"), ("price_usd_y", "product_price"),
                     ("product_name_x", "product_name"), ("brand_name_x", "brand_name")]:
        if old in df.columns and new not in df.columns:
            df.rename(columns={old: new}, inplace=True)

    df["helpfulness"] = df["helpfulness"].fillna(0)
    df["weighted_rating"] = df["review_rating"] * (1 + df["total_pos_feedback_count"])
    return df


def build_skin_match(full_data: pd.DataFrame) -> pd.DataFrame:
    """
    Returns a DataFrame indexed by product_id with skin-type review ratios.
    Columns: combination, dry, normal, oily (any skin_type values in the data).
    """
    skin_counts = full_data.groupby(["product_id", "skin_type"]).size().unstack(fill_value=0)
    skin_ratios = skin_counts.div(skin_counts.sum(axis=1), axis=0)
    return skin_ratios


def build_product_stats(full_data: pd.DataFrame) -> pd.DataFrame:
    """Aggregate review-level data to one row per product."""
    product_stats = full_data.groupby("product_id").agg(
        product_name      = ("product_name",      "first"),
        brand_name        = ("brand_name",         "first"),
        product_rating    = ("product_rating",     "mean"),
        avg_review_rating = ("review_rating",      "mean"),
        rating_std        = ("review_rating",      "std"),
        review_count      = ("review_rating",      "count"),
        weighted_rating   = ("weighted_rating",    "mean"),
        loves_count       = ("loves_count",        "mean"),
        review_total      = ("reviews",            "mean"),
        ingredients       = ("ingredients",        "first"),
        primary_category  = ("primary_category",   "first"),
        secondary_category= ("secondary_category", "first"),
        tertiary_category = ("tertiary_category",  "first"),
        highlights        = ("highlights",         "first"),
        price             = ("product_price",      "mean"),
        exclusive         = ("sephora_exclusive",  "mean"),
        is_new            = ("new",                "mean"),
    ).reset_index()

    # Popularity score (log-normalised)
    product_stats["popularity"] = np.log1p(
        product_stats["loves_count"] + product_stats["review_total"]
    )
    pop_min = product_stats["popularity"].min()
    pop_max = product_stats["popularity"].max()
    product_stats["popularity_score"] = (
        (product_stats["popularity"] - pop_min) / (pop_max - pop_min + 1e-9)
    )

    # Confidence-weighted rating score
    max_log_count = np.log1p(product_stats["review_count"].max())
    product_stats["confidence"] = (
        np.log1p(product_stats["review_count"]) / (max_log_count + 1e-9)
    )
    product_stats["rating_score"]    = (product_stats["avg_review_rating"] - 1) / 4
    product_stats["adjusted_rating"] = product_stats["rating_score"] * product_stats["confidence"]

    # Hype score (lower std = more consistent = lower hype-risk)
    product_stats["rating_std"] = product_stats["rating_std"].fillna(0)
    product_stats["hype_score"] = 1 / (1 + product_stats["rating_std"])

    return product_stats


# ═══════════════════════════════════════════════════════════════════════════════
# Ingredient Scoring
# ═══════════════════════════════════════════════════════════════════════════════

def ingredient_compatibility_score(
    ingredient_string: str | float,
    user_profile: dict,
    ingredient_risk: pd.DataFrame,
) -> float:
    """
    Returns a 0–1 compatibility score between a product's ingredients and the
    user's skin profile.  Higher = better match.
    """
    if pd.isna(ingredient_string) or not ingredient_string:
        return 0.5  # neutral when ingredients unknown

    ingredients = {ing.strip().lower() for ing in str(ingredient_string).split(",")}

    risk_weights = {
        "acne_risk":        0.20,
        "irritation_risk":  0.25,
        "dry_skin_risk":    0.15,
        "sensitivity_risk": 0.25,
    }

    penalties = 0.0
    for _, row in ingredient_risk.iterrows():
        ing_name = str(row["ingredient_name"]).lower().strip()
        if ing_name in ingredients:
            if user_profile.get("acne_prone", False):
                penalties += row.get("acne_risk", 0) * risk_weights["acne_risk"]
            if user_profile.get("skin_sensitivity", "Low") in ("High", "Very High"):
                penalties += row.get("irritation_risk", 0) * risk_weights["irritation_risk"]
            if str(user_profile.get("skin_type", "")).lower() == "dry":
                penalties += row.get("dry_skin_risk", 0) * risk_weights["dry_skin_risk"]

    if user_profile.get("fragrance_allergy", False) and "fragrance" in ingredients:
        penalties += 0.3

    return float(max(min(1.0 - penalties, 1.0), 0.0))


def ingredient_reason_codes(
    ingredient_string: str | float,
    user_profile: dict,
    ingredient_risk: pd.DataFrame,
) -> list[str]:
    """
    Returns a list of human-readable warning strings for ingredient concerns.
    Empty list means no concerns found.
    """
    reasons: list[str] = []
    if pd.isna(ingredient_string) or not ingredient_string:
        return reasons

    ingredients = {ing.strip().lower() for ing in str(ingredient_string).split(",")}

    for _, row in ingredient_risk.iterrows():
        ing_name = str(row["ingredient_name"]).lower().strip()
        if ing_name in ingredients:
            if user_profile.get("acne_prone", False) and row.get("acne_risk", 0) > 0:
                reasons.append(f"{row['ingredient_name']} may trigger acne breakouts.")
            if user_profile.get("skin_sensitivity", "Low") in ("High", "Very High") and row.get("irritation_risk", 0) > 0:
                reasons.append(f"{row['ingredient_name']} may irritate sensitive skin.")
            if str(user_profile.get("skin_type", "")).lower() == "dry" and row.get("dry_skin_risk", 0) > 0:
                reasons.append(f"{row['ingredient_name']} may worsen dryness.")

    if user_profile.get("fragrance_allergy", False) and "fragrance" in ingredients:
        reasons.append("Contains fragrance — allergy alert!")

    return reasons


# ═══════════════════════════════════════════════════════════════════════════════
# Highlight Scoring
# ═══════════════════════════════════════════════════════════════════════════════

def highlight_score(highlights_str: str | float, user_profile: dict) -> float:
    """
    Returns 0–1 based on how well product highlights match the user's concerns.
    0.5 = neutral (no data or no concerns specified).
    """
    if pd.isna(highlights_str) or not highlights_str:
        return 0.5

    try:
        highlights = [h.lower() for h in eval(str(highlights_str))]  # noqa: S307
    except Exception:
        highlights = [str(highlights_str).lower()]

    concerns = [c.lower() for c in user_profile.get("skin_concerns", [])]
    if not concerns:
        return 0.5

    hits = sum(1 for concern in concerns if any(concern in h for h in highlights))
    return hits / len(concerns)


# ═══════════════════════════════════════════════════════════════════════════════
# Collaborative Filtering
# ═══════════════════════════════════════════════════════════════════════════════

def get_collab_scores(
    user_id,
    user_profile: dict,
    full_data: pd.DataFrame,
    top_n_sim_users: int = 50,
) -> dict:
    """
    Collaborative filtering: weight other users' product ratings by a
    blend of profile similarity + rating-history similarity.

    Returns:
        {product_id: normalised_score (0–1)}  or  {} if user not found.
    """
    profile_cols = ["skin_type", "skin_tone", "skin_sensitivity", "eye_color", "hair_color"]

    # Build user × product matrix
    user_product_matrix = full_data.pivot_table(
        index="author_id",
        columns="product_id",
        values="weighted_rating",
        fill_value=0,
    )

    if user_id not in user_product_matrix.index:
        log.debug(f"user_id {user_id} not found in rating matrix — skipping collaborative filtering.")
        return {}

    # Profile similarity
    available_cols = [c for c in profile_cols if c in full_data.columns]
    profile_df = full_data.groupby("author_id")[available_cols].first().fillna("unknown")
    profile_encoded = pd.get_dummies(profile_df)

    target_profile = {col: user_profile.get(col, "unknown") for col in available_cols}
    target_df = pd.get_dummies(pd.DataFrame([target_profile])).reindex(
        columns=profile_encoded.columns, fill_value=0
    )

    profile_sim = cosine_similarity(profile_encoded, target_df).flatten()
    profile_sim_df = pd.DataFrame({"author_id": profile_encoded.index, "profile_similarity": profile_sim})

    # Rating similarity
    user_vec = user_product_matrix.loc[user_id].values.reshape(1, -1)
    rating_sim = cosine_similarity(user_product_matrix, user_vec).flatten()
    rating_sim_df = pd.DataFrame({"author_id": user_product_matrix.index, "rating_similarity": rating_sim})

    sim_df = profile_sim_df.merge(rating_sim_df, on="author_id")
    sim_df["similarity"] = 0.6 * sim_df["profile_similarity"] + 0.4 * sim_df["rating_similarity"]
    sim_df = sim_df[sim_df["author_id"] != user_id]

    top_users = sim_df.nlargest(top_n_sim_users, "similarity").set_index("author_id")

    # Weighted product scores
    relevant = full_data[full_data["author_id"].isin(top_users.index)]
    sim_lookup = top_users["similarity"].to_dict()

    def _weighted(group):
        sims = group["author_id"].map(sim_lookup).fillna(0)
        return (group["weighted_rating"] * sims).sum()

    weighted_scores = relevant.groupby("product_id").apply(_weighted).to_dict()

    max_score = max(weighted_scores.values(), default=1)
    if max_score > 0:
        weighted_scores = {k: v / max_score for k, v in weighted_scores.items()}

    return weighted_scores


# ═══════════════════════════════════════════════════════════════════════════════
# Main Recommender Class
# ═══════════════════════════════════════════════════════════════════════════════

class SkintelligentRecommender:
    """
    Full hybrid recommendation engine.

    Quick-start:
        rec = SkintelligentRecommender()          # reads env var
        rec = SkintelligentRecommender(csv_path="../data/")   # local CSV fallback

    Weights (sum to 1.0):
        ingredient_score  0.25
        adjusted_rating   0.15
        popularity_score  0.10
        hype_score        0.05
        skin_match        0.15
        highlight_score   0.05
        sentiment         0.10   ← NLP pipeline slot (placeholder = 0.5)
        collab            0.15
    """
    

    WEIGHTS = {
        "ingredient_score": 0.25,
        "adjusted_rating":  0.15,
        "popularity_score": 0.10,
        "hype_score":       0.05,
        "skin_match":       0.15,
        "highlight_score":  0.05,
        "sentiment":        0.10,
        "collab":           0.15,
    }

    def __init__(
        self,
        db_url: str | None = None,
        csv_path: str | None = None,
        sentiment_scores: dict | None = None,
    ):
        """
        Args:
            db_url:           SQLAlchemy URL (defaults to SKINTELLIGENT_DATABASE_URL env var).
            csv_path:         Path prefix for local CSV fallback, e.g. '../data/'.
            sentiment_scores: Optional dict {product_id: float (-1 to 1)} from the NLP pipeline.
                              If omitted, sentiment defaults to 0.5 (neutral) for all products.
        """
        log.info("Initialising Skintelligent Recommender …")
        self.full_data, self.ingredient_risk = load_data(db_url=db_url, csv_path=csv_path)
        self.full_data   = engineer_features(self.full_data)
        self.skin_match  = build_skin_match(self.full_data)
        self.product_stats = build_product_stats(self.full_data)

        # NLP sentiment scores: normalised to 0–1 range
        if sentiment_scores:
            # input range: -1 … 1  →  output: 0 … 1
            self.sentiment_scores = {pid: (score + 1) / 2 for pid, score in sentiment_scores.items()}
            log.info(f"✓ Loaded sentiment scores for {len(self.sentiment_scores):,} products.")
        else:
            self.sentiment_scores = {}
            log.info("No NLP sentiment scores provided — using neutral placeholder (0.5).")

        log.info(f"✓ Ready. {len(self.product_stats):,} products indexed.")

    # ── Public API ───────────────────────────────────────────────────────────

    def recommend(
        self,
        user_profile: dict,
        user_id=None,
        top_n: int = 10,
        category_filter: str | None = None,
    ) -> pd.DataFrame:
        """
        Generate personalised product recommendations.

        Args:
            user_profile: dict with any of:
                skin_type         str   "oily" | "dry" | "combination" | "normal" | "sensitive"
                skin_concerns     list  ["Acne", "Dryness", …]
                acne_prone        bool
                skin_sensitivity  str   "Low" | "Medium" | "High" | "Very High"
                fragrance_allergy bool
                skin_tone         str
                eye_color         str
                hair_color        str
            user_id:          author_id for collaborative filtering (None = new user).
            top_n:            Number of recommendations to return.
            category_filter:  Optional secondary_category to restrict results.

        Returns:
            DataFrame with columns:
                product_id, product_name, brand_name, price, final_score,
                ingredient_score, skin_match, sentiment, collab,
                ingredient_warnings, fit_label
        """
        log.info(f"Generating recommendations for user_id={user_id} …")
        df = self.product_stats.copy()

        # Optional category filter
        if category_filter:
            df = df[df["secondary_category"].str.lower() == category_filter.lower()]
            if df.empty:
                log.warning(f"No products found for category '{category_filter}'.")
                return df

        # ── Score components ─────────────────────────────────────────────────
        df["ingredient_score"] = df["ingredients"].apply(
            lambda x: ingredient_compatibility_score(x, user_profile, self.ingredient_risk)
        )

        skin_type = str(user_profile.get("skin_type", "")).lower()
        if skin_type in self.skin_match.columns:
            df["skin_match"] = df["product_id"].map(self.skin_match[skin_type]).fillna(0)
        else:
            df["skin_match"] = 0.5

        df["highlight_score"] = df["highlights"].apply(
            lambda x: highlight_score(x, user_profile)
        )

        # NLP sentiment (placeholder = 0.5 until pipeline is wired)
        df["sentiment"] = df["product_id"].map(self.sentiment_scores).fillna(0.5)

        # Collaborative filtering
        if user_id is not None:
            collab = get_collab_scores(user_id, user_profile, self.full_data)
            df["collab"] = df["product_id"].map(collab).fillna(0)
        else:
            df["collab"] = 0.0
        if df["collab"].max() > 0:
            df["collab"] = df["collab"] / df["collab"].max()

        # ── Final hybrid score ───────────────────────────────────────────────
        w = self.WEIGHTS
        df["final_score"] = (
            w["ingredient_score"] * df["ingredient_score"] +
            w["adjusted_rating"]  * df["adjusted_rating"]  +
            w["popularity_score"] * df["popularity_score"] +
            w["hype_score"]       * df["hype_score"]       +
            w["skin_match"]       * df["skin_match"]       +
            w["highlight_score"]  * df["highlight_score"]  +
            w["sentiment"]        * df["sentiment"]        +
            w["collab"]           * df["collab"]
        )

        # ── Enrich output ────────────────────────────────────────────────────
        df["ingredient_warnings"] = df["ingredients"].apply(
            lambda x: ingredient_reason_codes(x, user_profile, self.ingredient_risk)
        )
        df["fit_label"] = df["final_score"].apply(_fit_label)

        output_cols = [
            "product_id", "product_name", "brand_name", "price",
            "final_score", "ingredient_score", "adjusted_rating",
            "popularity_score", "skin_match", "sentiment", "collab",
            "ingredient_warnings", "fit_label",
            "secondary_category", "tertiary_category",
        ]
        result = (
            df[output_cols]
            .sort_values("final_score", ascending=False)
            .head(top_n)
            .reset_index(drop=True)
        )

        log.info(f"✓ Returned {len(result)} recommendations.")
        _print_recommendations(result)
        return result

    def lookup(self, product_id: str, user_profile: dict) -> dict | None:
        """
        Return a single product's full analysis for the product detail page.

        Returns:
            dict with score breakdown + ingredient warnings, or None if not found.
        """
        row = self.product_stats[self.product_stats["product_id"] == product_id]
        if row.empty:
            log.warning(f"Product {product_id} not found.")
            return None

        row = row.iloc[0]
        ing_score  = ingredient_compatibility_score(row["ingredients"], user_profile, self.ingredient_risk)
        ing_warns  = ingredient_reason_codes(row["ingredients"], user_profile, self.ingredient_risk)
        hl_score   = highlight_score(row["highlights"], user_profile)
        sentiment  = self.sentiment_scores.get(product_id, 0.5)

        skin_type = str(user_profile.get("skin_type", "")).lower()
        skin_m = (
            self.skin_match.at[product_id, skin_type]
            if product_id in self.skin_match.index and skin_type in self.skin_match.columns
            else 0.5
        )

        w = self.WEIGHTS
        score = (
            w["ingredient_score"] * ing_score +
            w["adjusted_rating"]  * row["adjusted_rating"] +
            w["popularity_score"] * row["popularity_score"] +
            w["hype_score"]       * row["hype_score"] +
            w["skin_match"]       * skin_m +
            w["highlight_score"]  * hl_score +
            w["sentiment"]        * sentiment
        )

        return {
            "product_id":         product_id,
            "product_name":       row["product_name"],
            "brand_name":         row["brand_name"],
            "price":              row["price"],
            "fit_score":          round(score * 100),
            "fit_label":          _fit_label(score),
            "ingredient_score":   round(ing_score, 3),
            "skin_match":         round(skin_m, 3),
            "sentiment":          round(sentiment, 3),
            "hype_score":         round(row["hype_score"], 3),
            "avg_review_rating":  round(row["avg_review_rating"], 2),
            "review_count":       int(row["review_count"]),
            "ingredient_warnings": ing_warns,
            "secondary_category": row["secondary_category"],
        }


# ═══════════════════════════════════════════════════════════════════════════════
# Helpers
# ═══════════════════════════════════════════════════════════════════════════════

def _fit_label(score: float) -> str:
    if score >= 0.80:
        return "Excellent Match"
    elif score >= 0.65:
        return "Great Match"
    elif score >= 0.50:
        return "Good Match"
    elif score >= 0.35:
        return "Fair Match"
    else:
        return "Poor Match"


def _print_recommendations(df: pd.DataFrame) -> None:
    """Pretty-print top recommendations to the console."""
    print("\n" + "─" * 60)
    print("  🌿  SKINTELLIGENT — Your Top Picks")
    print("─" * 60)
    for i, row in df.iterrows():
        score_pct = round(row["final_score"] * 100)
        label     = row["fit_label"]
        warns     = row["ingredient_warnings"]
        warn_str  = f"  ⚠  {warns[0]}" if warns else ""
        print(f"  {i+1:>2}. [{score_pct:>3}%  {label:<16}]  {row['brand_name']} — {row['product_name']}{warn_str}")
    print("─" * 60 + "\n")


# ═══════════════════════════════════════════════════════════════════════════════
# CLI / Quick Test
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    """
    Quick smoke-test.  Run with:
        python recommender.py

    Reads SKINTELLIGENT_DATABASE_URL from .env, or falls back to ../data/ CSVs.
    """
    SAMPLE_PROFILE = {
        "skin_type":         "combination",
        "skin_concerns":     ["Acne", "Hyperpigmentation", "Dryness"],
        "acne_prone":        True,
        "skin_sensitivity":  "High",
        "fragrance_allergy": False,
        "skin_tone":         "medium",
        "eye_color":         "brown",
        "hair_color":        "black",
    }

    rec = SkintelligentRecommender(
        csv_path="data/",          # remove when DB is live
    )

    results = rec.recommend(SAMPLE_PROFILE, user_id=None, top_n=10)
    print(results[["product_name", "brand_name", "final_score", "fit_label"]].to_string(index=False))

    # Single product lookup example
    if not results.empty:
        pid    = results.iloc[0]["product_id"]
        detail = rec.lookup(pid, SAMPLE_PROFILE)
        print(f"\nDetail for {pid}:")
        for k, v in detail.items():
            print(f"  {k}: {v}")
