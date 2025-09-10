import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>\
    <rect width='100%' height='100%' fill='%23f2f2f2'/>\
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'\
      fill='%23999' font-family='Arial' font-size='22'>Staff photo</text></svg>";

const FALLBACK_STAFF = [
  {
    id: "temp-1",
    first: "Ava",
    last: "Nguyen",
    role: "Staff",
    bio: "Specializes in gel finishes and intricate hand-painted designs. 6+ years experience.",
    photoUrl: "https://img.freepik.com/premium-photo/close-up-beautiful-asian-woman-beauty-blogger_1258-31223.jpg",
    bookingUrl: "#",
  },
  {
    id: "temp-2",
    first: "Marco",
    last: "Cruz",
    role: "Staff",
    bio: "Known for durable acrylic sets and custom shapes. Loves bold colors.",
    photoUrl: "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww",
    bookingUrl: "#",
  },
  {
    id: "temp-3",
    first: "Jin",
    last: "Park",
    role: "Staff",
    bio: "Lightweight, natural-looking finishes with careful prep for nail health.",
    photoUrl: "https://images.pexels.com/photos/3761521/pexels-photo-3761521.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    bookingUrl: "#",
  },
  {
    id: "temp-4",
    first: "Sofia",
    last: "Rivera",
    role: "Staff",
    bio: "Therapeutic pedicures with a focus on massage and relaxation.",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
    bookingUrl: "#",
  },
  {
  id: "temp-5",
  first: "Noah",
  last: "Kim",
  role: "Staff",
  bio: "Detail-focused gel overlays and structured manicures. 4+ years experience.",
  photoUrl: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  bookingUrl: "#",
},
{
  id: "temp-6",
  first: "Lena",
  last: "Martinez",
  role: "Staff",
  bio: "Specializes in spa pedicures and natural nail care. Gentle, relaxing service.",
  photoUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  bookingUrl: "#",
}
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
        <h1 className="display-6 auth-title">Our Team</h1>
        <p className="text-muted mx-auto " style={{ maxWidth: 720 }}>
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
function StaffCard({ first, last, role, bio, photoUrl}) {
  return (
    <div className="card h-100 shadow-sm p-3 text-center team-card hover-lift">
      <div className="ratio ratio-4x3">
        <img
          src={photoUrl || PLACEHOLDER_IMG}
          alt={first}
          className="w-100 h-100 object-cover rounded-top"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "12px",
          }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title mb-1">{first} {last}</h5>
        <p className="text-gold small mb-2">{role}</p>
        <p className="card-text text-muted mb-3">{bio}</p>
         <Link
          to="/booking-app"
          className="btn btn-gold btn-sm"
        >
          Book
        </Link>
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
