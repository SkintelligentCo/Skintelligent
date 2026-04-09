export default function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = 999,
  style = {},
  className = "",
}) {
  return (
    <div
      className={`skeleton-block ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
