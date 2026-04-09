import * as s from "../styles/shared";
import SkeletonBlock from "./SkeletonBlock";

function SkeletonChipRow({ count = 4, widths = [88, 96, 82, 92], gap = "0.45rem" }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap }}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonBlock key={index} width={widths[index % widths.length]} height={30} radius={999} />
      ))}
    </div>
  );
}

export function SectionHeadingSkeleton({ titleWidth = "44%", subWidth = "58%", marginBottom = "2rem" }) {
  return (
    <div aria-hidden="true" style={{ marginBottom }}>
      <SkeletonBlock width={104} height={11} radius={999} style={{ marginBottom: "0.85rem" }} />
      <SkeletonBlock width={titleWidth} height={42} radius={18} style={{ marginBottom: "0.7rem" }} />
      <SkeletonBlock width={subWidth} height={15} radius={999} />
    </div>
  );
}

export function DashboardHeroSkeleton() {
  return (
    <div
      className="motion-liquid-surface"
      style={{
        ...s.card,
        marginBottom: "3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.5rem",
      }}
      aria-hidden="true"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", minWidth: 260 }}>
        <SkeletonBlock width={56} height={56} radius="50%" />
        <div style={{ flex: 1, minWidth: 180 }}>
          <SkeletonBlock width="72%" height={24} radius={12} style={{ marginBottom: "0.55rem" }} />
          <SkeletonBlock width="42%" height={12} radius={999} />
        </div>
      </div>

      <div style={{ flex: "1 1 260px", minWidth: 240 }}>
        <SkeletonChipRow count={5} widths={[94, 102, 80, 88, 96]} />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <SkeletonBlock width={116} height={42} radius={999} />
        <SkeletonBlock width={190} height={46} radius={999} />
      </div>
    </div>
  );
}

export function ProfileFormSkeleton() {
  const fieldWidths = ["26%", "34%", "31%", "29%", "27%", "28%", "24%", "35%"];
  return (
    <div className="motion-liquid-surface" style={s.card} aria-hidden="true">
      <SkeletonBlock width={110} height={11} radius={999} style={{ marginBottom: "0.9rem" }} />
      <SkeletonBlock width="54%" height={42} radius={18} style={{ marginBottom: "2rem" }} />

      {fieldWidths.map((width, index) => (
        <div key={index} style={{ marginBottom: index === fieldWidths.length - 1 ? "1.6rem" : "2rem" }}>
          <SkeletonBlock width={width} height={18} radius={10} style={{ marginBottom: "0.8rem" }} />
          <SkeletonChipRow count={index % 2 === 0 ? 5 : 4} widths={[86, 98, 110, 92, 104]} />
        </div>
      ))}

      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "1.6rem" }}>
        <SkeletonBlock width={148} height={38} radius={999} />
        <SkeletonBlock width={164} height={38} radius={999} />
      </div>

      <SkeletonBlock width={160} height={48} radius={999} />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="motion-liquid-surface" style={s.card} aria-hidden="true">
      <SkeletonBlock width={72} height={14} radius={999} style={{ marginBottom: "1.1rem" }} />

      <div style={{ marginBottom: "1.5rem" }}>
        <SkeletonBlock width="52%" height={11} radius={999} style={{ marginBottom: "0.6rem" }} />
        <SkeletonBlock width="74%" height={34} radius={16} />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <SkeletonChipRow count={3} widths={[126, 132, 144]} />
      </div>

      <div
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
        <SkeletonBlock width={64} height={64} radius="50%" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <SkeletonBlock width="30%" height={18} radius={12} style={{ marginBottom: "0.55rem" }} />
          <SkeletonBlock width="96%" height={12} radius={999} style={{ marginBottom: "0.45rem" }} />
          <SkeletonBlock width="74%" height={12} radius={999} />
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.55rem", marginBottom: "1.5rem" }}>
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} width="100%" height={40} radius={12} />
        ))}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <SkeletonChipRow count={6} widths={[84, 96, 92, 104, 90, 88]} gap="0.35rem" />
      </div>

      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index}>
            <SkeletonBlock width="26%" height={12} radius={999} style={{ marginBottom: "0.35rem" }} />
            <SkeletonBlock width="100%" height={12} radius={999} />
          </div>
        ))}
      </div>

      <SkeletonBlock width="100%" height={92} radius={16} style={{ marginBottom: "1.5rem" }} />
      <SkeletonBlock width="100%" height={50} radius={999} />
    </div>
  );
}

export function GuardShellSkeleton({ withNavOffset = true }) {
  return (
    <div
      className="page-shell page-shell--ambient"
      style={{
        ...s.page,
        paddingTop: withNavOffset ? "6rem" : 0,
        display: "grid",
        placeItems: "center",
        paddingInline: "1.5rem",
      }}
    >
      <div
        className="motion-liquid-surface"
        style={{ ...s.card, width: "min(100%, 440px)", textAlign: "center", paddingBlock: "2.4rem" }}
        aria-hidden="true"
      >
        <SkeletonBlock width={70} height={70} radius="50%" style={{ margin: "0 auto 1.1rem" }} />
        <SkeletonBlock width="52%" height={24} radius={14} style={{ margin: "0 auto 0.65rem" }} />
        <SkeletonBlock width="74%" height={12} radius={999} style={{ margin: "0 auto 0.45rem" }} />
        <SkeletonBlock width="56%" height={12} radius={999} style={{ margin: "0 auto" }} />
      </div>
    </div>
  );
}
