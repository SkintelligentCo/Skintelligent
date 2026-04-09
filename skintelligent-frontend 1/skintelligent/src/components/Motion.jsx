function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

const variantClasses = {
  reveal: "motion-reveal",
  pop: "motion-pop-in",
  bounce: "motion-bounce-in",
  liquid: "motion-liquid-in",
};

export function PageTransition({
  as: Tag = "div",
  children,
  className = "",
  style = {},
  delay = 0,
  ...props
}) {
  return (
    <Tag
      className={joinClasses("motion-page", "page-shell", "page-shell--ambient", className)}
      style={{
        ...style,
        "--delay": `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  style = {},
  delay = 0,
  index,
  variant = "reveal",
  ...props
}) {
  return (
    <Tag
      className={joinClasses(variantClasses[variant] || variantClasses.reveal, className)}
      style={{
        ...style,
        "--delay": `${delay}ms`,
        "--stagger-index": index ?? 0,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function StaggerGroup({ as: Tag = "div", children, className = "", style = {}, ...props }) {
  return (
    <Tag className={joinClasses("motion-stagger", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}
