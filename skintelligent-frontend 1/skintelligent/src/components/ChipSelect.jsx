import { chip as chipStyle } from "../styles/shared";

export default function ChipSelect({ items, selected, onChange, multi = true }) {
  const toggle = (item) => {
    if (multi) {
      onChange(selected.includes(item) ? selected.filter(i => i !== item) : [...selected, item]);
    } else {
      onChange(item);
    }
  };

  const isActive = (item) => (multi ? selected.includes(item) : selected === item);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1rem" }}>
      {items.map(item => (
        <button key={item} onClick={() => toggle(item)} style={chipStyle(isActive(item))}>
          {isActive(item) && "✓ "}{item}
        </button>
      ))}
    </div>
  );
}
