// src/front/components/BarberGrid.jsx
import { PopupButton } from "react-calendly";

const barbers = [
  {
    id: 1,
    name: "Edgard J.",
    photo: "/assets/barbers/edgard.jpg",
    calendly: "https://calendly.com/edgardj/haircut-30",
  },
  {
    id: 2,
    name: "Marcos C.",
    photo: "/assets/barbers/marcos.jpg",
    calendly: "https://calendly.com/marcoscuts/haircut-30",
  },
  // ...
];

export default function BarberGrid({ user }) {
  return (
    <div className="grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "16px"
    }}>
      {barbers.map(b => (
        <div key={b.id} className="card" style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16, padding: 16, background: "white"
        }}>
          <img src={b.photo} alt={b.name}
               style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12 }} />
          <h3 style={{ margin: "12px 0 4px" }}>{b.name}</h3>
          <p style={{ color: "#6b7280", marginBottom: 12 }}>Available Tomorrow</p>

          <PopupButton
            url={b.calendly}
            rootElement={document.getElementById("root")}
            text="Book with this pro"
            prefill={{
              name: user?.name,
              email: user?.email
            }}
          />
        </div>
      ))}
    </div>
  );
}
