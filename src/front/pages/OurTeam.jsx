import React, { useEffect, useState } from "react";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>\
    <rect width='100%' height='100%' fill='%23f2f2f2'/>\
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'\
      fill='%23999' font-family='Arial' font-size='22'>Staff photo</text></svg>";

const FALLBACK_STAFF = [
  {
    id: "temp-1",
    name: "Ava Nguyen",
    role: "Senior Nail Artist",
    bio: "Specializes in gel finishes and intricate hand-painted designs. 6+ years experience.",
    photoUrl: PLACEHOLDER_IMG,
    bookingUrl: "#",
  },
  {
    id: "temp-2",
    name: "Marcos Cruz",
    role: "Acrylic & Sculpting",
    bio: "Known for durable acrylic sets and custom shapes. Loves bold colors.",
    photoUrl: PLACEHOLDER_IMG,
    bookingUrl: "#",
  },
  {
    id: "temp-3",
    name: "Jin Park",
    role: "Dip Powder Expert",
    bio: "Lightweight, natural-looking finishes with careful prep for nail health.",
    photoUrl: PLACEHOLDER_IMG,
    bookingUrl: "#",
  },
  {
    id: "temp-4",
    name: "Sofia Rivera",
    role: "Spa Pedicures",
    bio: "Therapeutic pedicures with a focus on massage and relaxation.",
    photoUrl: PLACEHOLDER_IMG,
    bookingUrl: "#",
  },
];

export function OurTeam() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const base = import.meta.env.VITE_BACKEND_URL;
        const url = `${base}/api/staff`

        if (!url) throw new Error("No backend URL configured");

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();

        setStaff(Array.isArray(data) ? data : []);
      } catch (e) {
        // Fallback staff as placeholders until backend is ready
        setErr(e.message || "Failed to load staff");
        setStaff(FALLBACK_STAFF);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="container py-5 text-start">
      <div className="text-center mb-4">
        <h1 className="display-6 fw-bold">Our Team</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: 720 }}>
          Meet the artists behind your look. Our talented team of artists is the heart of everything we do. Each of our staff members brings unique expertise, creativity, and passion to ensure every client leaves feeling confident and pampered.
        </p>
      </div>

      {/* Grid */}
      <div className="row g-4">
        {(loading ? Array.from({ length: 6 }) : staff).map((item, i) => (
          <div key={item?.id || i} className="col-12 col-sm-6 col-lg-4">
            {loading ? <StaffCardSkeleton /> : <StaffCard {...item} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Card for a staff member ---
function StaffCard({ name, role, bio, photoUrl, bookingUrl }) {
  return (
    <div className="card h-100 shadow-sm team-card hover-lift">
      <div className="ratio ratio-4x3">
        <img
          src={photoUrl || PLACEHOLDER_IMG}
          alt={name}
          className="w-100 h-100 object-cover rounded-top"
        />
      </div>
      <div className="card-body">
        <h5 className="card-title mb-1">{name}</h5>
        <p className="text-gold small mb-2">{role}</p>
        <p className="card-text text-muted mb-3">{bio}</p>

        <div className="d-flex gap-2">
          {/* Replace href with Calendly/Square link when available */}
          <a
            href={bookingUrl || "#"}
            className="btn btn-gold btn-sm"
            onClick={(e) => {
              if (!bookingUrl || bookingUrl === "#") {
                e.preventDefault();
              }
            }}
          >
            Book
          </a>
        </div>
      </div>
    </div>
  );
}

// --- Skeleton loader while fetching ---
function StaffCardSkeleton() {
  return (
    <div className="card h-100 shadow-sm">
      <div className="ratio ratio-4x3 bg-light placeholder-wave">
        <span className="placeholder col-12" />
      </div>
      <div className="card-body">
        <h5 className="card-title placeholder-glow">
          <span className="placeholder col-6" />
        </h5>
        <p className="placeholder-glow mb-2">
          <span className="placeholder col-4" />
        </p>
        <p className="placeholder-glow">
          <span className="placeholder col-12 mb-1" />
          <span className="placeholder col-10 mb-1" />
          <span className="placeholder col-8" />
        </p>
        <div className="d-flex gap-2">
          <span className="btn btn-secondary disabled placeholder col-4" />
          <span className="btn btn-secondary disabled placeholder col-3" />
        </div>
      </div>
    </div>
  );
}
