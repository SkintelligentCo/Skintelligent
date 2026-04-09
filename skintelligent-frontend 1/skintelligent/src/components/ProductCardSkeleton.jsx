import * as s from "../styles/shared";
import SkeletonBlock from "./SkeletonBlock";

export function ProductCardSkeleton() {
  return (
    <div
      className="motion-liquid-surface"
      style={{
        ...s.card,
        minHeight: 430,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      aria-hidden="true"
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <SkeletonBlock width="34%" height={12} radius={999} style={{ marginBottom: "0.55rem" }} />
          <SkeletonBlock width="86%" height={20} radius={12} style={{ marginBottom: "0.4rem" }} />
          <SkeletonBlock width="62%" height={20} radius={12} />
        </div>
        <SkeletonBlock width={52} height={52} radius="50%" style={{ flexShrink: 0 }} />
      </div>

      <div style={{ minHeight: 66 }}>
        <SkeletonBlock width="100%" height={12} radius={999} style={{ marginBottom: "0.5rem" }} />
        <SkeletonBlock width="94%" height={12} radius={999} style={{ marginBottom: "0.5rem" }} />
        <SkeletonBlock width="78%" height={12} radius={999} />
      </div>

      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", minHeight: 34 }}>
        <SkeletonBlock width={90} height={28} radius={999} />
        <SkeletonBlock width={78} height={28} radius={999} />
        <SkeletonBlock width={84} height={28} radius={999} />
      </div>

      <div style={{ minHeight: 76 }}>
        <SkeletonBlock width="100%" height={74} radius={16} />
      </div>

      <div style={{ minHeight: 58 }}>
        <SkeletonBlock width="100%" height={56} radius={16} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return Array.from({ length: count }, (_, index) => <ProductCardSkeleton key={index} />);
}
