// src/front/components/ServiceCard.jsx
export default function ServiceCard({
  icon, title, desc, price,
  selected = false,
  onSelect,
  compact = false,
  actionLabel = "Select"
}) {
  const iconSize = compact ? 25 : 50;
  const titleClass = compact ? "fs-5" : "fs-4";

  return (
    <div
      className='card shadow-sm text-center p-3 hover-lift h-100'
      style={{
                    width: "80%",
                    height: "300px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    transition: "all 0.2s ease-in-out",
                    borderStyle: "solid",
                    borderColor: selected ? "var(--gold)" : "transparent",
                }}
      role="button"
      onClick={onSelect}
    >
      <div className="card-body d-flex flex-column text-center">
        <div
          className="icon-bubble mx-auto mb-2"
          style={{ width: iconSize, height: iconSize, fontSize: compact ? 20 : 24 }}
        >
          <i className={`fa-solid ${icon}`} />
        </div>

        <h5 className={`card-title mt-1 ${titleClass}`}>{title}</h5>
        <p className={`card-text ${compact ? "small" : ""} text-muted mb-3`} style={{ minHeight: compact ? 40 : 64 }}>
          {desc}
        </p>

        <span className="price-pill align-self-center mb-1" style={{ fontSize: compact ? ".95rem" : "1rem", padding: ".25rem .6rem" }}>
          ${price}
        </span>
      </div>
    </div>
  );
}

