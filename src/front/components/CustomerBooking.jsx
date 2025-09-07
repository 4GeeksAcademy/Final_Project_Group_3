// /frontend/src/components/CustomerBooking.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Star, MessageSquare, Check } from "lucide-react";
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard.jsx";
import { SERVICES_BY_CATEGORY } from "../auth/servicesData.js";

// ---- API base (Vite or CRA) ----
// Use a Vite .env like: VITE_API_BASE=https://<YOUR-ID>-5000.app.github.dev
// or set up a Vite proxy and leave VITE_API_BASE empty.
const API_BASE =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
    (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
    "";
const API_ROOT = String(API_BASE || "").replace(/\/+$/, "");

// ---- Storage key ----
const LS_KEY = "salonBookings";

// ---- Mock data ----
const SERVICES = [
    { id: 1, name: "Classic Manicure", duration: 45, price: 35, description: "Basic nail care with polish" },
    { id: 2, name: "Gel Manicure", duration: 60, price: 50, description: "Long-lasting gel polish application" },
    { id: 3, name: "Classic Pedicure", duration: 60, price: 40, description: "Foot care with polish" },
    { id: 4, name: "Gel Pedicure", duration: 75, price: 55, description: "Long-lasting gel pedicure" },
    { id: 5, name: "Nail Art", duration: 30, price: 25, description: "Custom nail designs" },
    { id: 6, name: "Acrylic Full Set", duration: 90, price: 70, description: "Full acrylic nail extensions" },
    { id: 7, name: "Acrylic Fill", duration: 60, price: 45, description: "Acrylic nail maintenance" },
    { id: 8, name: "Dip Powder", duration: 75, price: 60, description: "Durable dip powder nails" }
];

// Substituted with backend Staff
// const STAFF = [
//     { id: 1, name: "Maria Rodriguez", specialties: ["Manicure", "Nail Art"], rating: 4.9, experience: "8 years" },
//     { id: 2, name: "Jessica Chen", specialties: ["Pedicure", "Gel Services"], rating: 4.8, experience: "6 years" },
//     { id: 3, name: "Ashley Johnson", specialties: ["Acrylics", "Extensions"], rating: 4.9, experience: "10 years" },
//     { id: 4, name: "Sofia Martinez", specialties: ["Dip Powder", "Nail Art"], rating: 4.7, experience: "5 years" }
// ];

const TIME_SLOTS = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
];

// Where the business alert SMS goes (owner phone). Backend uses OWNER_PHONE too.
const BUSINESS_PHONE = "+17864935524";

const FALLBACK_STAFF = [
    {
        id: "temp-1",
        name: "Ava Nguyen",
        role: "Senior Nail Artist",
        bio: "Specializes in gel finishes and intricate hand-painted designs. 6+ years experience.",
        photoUrl: "https://img.freepik.com/premium-photo/close-up-beautiful-asian-woman-beauty-blogger_1258-31223.jpg",
        bookingUrl: "#",
    },
    {
        id: "temp-2",
        name: "Marcos Cruz",
        role: "Acrylic & Sculpting",
        bio: "Known for durable acrylic sets and custom shapes. Loves bold colors.",
        photoUrl: "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww",
        bookingUrl: "#",
    },
    {
        id: "temp-3",
        name: "Jin Park",
        role: "Dip Powder Expert",
        bio: "Lightweight, natural-looking finishes with careful prep for nail health.",
        photoUrl: "https://images.pexels.com/photos/3761521/pexels-photo-3761521.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        bookingUrl: "#",
    },
    {
        id: "temp-4",
        name: "Sofia Rivera",
        role: "Spa Pedicures",
        bio: "Therapeutic pedicures with a focus on massage and relaxation.",
        photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
        bookingUrl: "#",
    },
];

export default function CustomerBooking() {
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

    const [selectedService, setSelectedService] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("card"); // card | cash
    const [tip, setTip] = useState("0");
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState(""); // MM/YY
    const [cardCvc, setCardCvc] = useState("");

    const [customerInfo, setCustomerInfo] = useState({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
    const [smsStatus, setSmsStatus] = useState("");
    const [currentBooking, setCurrentBooking] = useState(null);

    // ---- helpers/validation ----
    const isValidEmail = (s) => /\S+@\S+\.\S+/.test(s);
    const isValidPhone = (s) => /^\+?\d[\d\s\-()]{7,}$/.test(s);

    const cleanDigits = (s) => (s || "").replace(/\D/g, "");
    const cardLast4 = cleanDigits(cardNumber).slice(-4);
    const validCard =
        cleanDigits(cardNumber).length >= 13 &&
        cleanDigits(cardNumber).length <= 19 &&
        /^\d{4}$/.test(cardLast4);
    const validExpiry = /^\d{2}\/\d{2}$/.test(cardExpiry);
    const validCvc = /^\d{3,4}$/.test(cardCvc);

    const numericTip = Number.isFinite(Number(tip)) ? Number(tip) : 0;
    const total = (selectedService?.price || 0) + (numericTip || 0);

    const isFormValid = useMemo(() => {
        const basics =
            selectedService && selectedStaff && selectedDate && selectedTime &&
            customerInfo.firstName && customerInfo.lastName &&
            isValidEmail(customerInfo.email) && isValidPhone(customerInfo.phone);
        if (!basics) return false;
        if (paymentMethod === "cash") return true;
        return !!(cardName.trim() && validCard && validExpiry && validCvc);
    }, [
        selectedService, selectedStaff, selectedDate, selectedTime,
        customerInfo, paymentMethod, cardName, cardNumber, cardExpiry, cardCvc
    ]);

    const getAvailableDates = () => {
        const out = [], today = new Date();
        for (let i = 1; i <= 14; i++) { const d = new Date(today); d.setDate(today.getDate() + i); out.push(d.toISOString().split("T")[0]); }
        return out;
    };
    const formatDate = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

    // ---- SMS call with detailed error reporting ----
    async function sendSMS(booking) {
        setSmsStatus("Sending SMS notifications...");
        try {
            const url = `${API_ROOT}/api/sms/send`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ businessPhone: BUSINESS_PHONE, booking })
            });
            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch { data = { ok: false, error: text || `HTTP ${res.status}` }; }
            if (!res.ok || data?.ok === false) {
                throw new Error(data?.error || `HTTP ${res.status}`);
            }
            setSmsStatus("✅ SMS notifications sent successfully!");
        } catch (e) {
            console.error("SMS error:", e);
            setSmsStatus(`❌ SMS failed: ${e.message}`);
        } finally {
            setTimeout(() => setSmsStatus(""), 6000);
        }
    }

    const handleSubmit = async () => {
        const newBooking = {
            id: Date.now(),
            service: selectedService,
            staff: selectedStaff,
            date: selectedDate,
            time: selectedTime,
            payment: {
                method: paymentMethod,
                tip: Number(numericTip || 0),
                card: paymentMethod === "card" ? { name: cardName.trim(), last4: cardLast4, expiry: cardExpiry } : undefined
            },
            customer: customerInfo,
            status: "confirmed",
            createdAt: new Date().toISOString(),
            totals: { service: selectedService.price, tip: Number(numericTip || 0), total }
        };

        const list = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        localStorage.setItem(LS_KEY, JSON.stringify([...list, newBooking]));
        setCurrentBooking(newBooking);

        // wipe sensitive fields (we only save last4/expiry)
        setCardNumber(""); setCardCvc("");

        await sendSMS(newBooking);
    };

    // --- Card for a staff member ---
    function StaffCard({ first, last, role, photoUrl, isSelected }) {
        return (
            <div
                className="card shadow-sm text-center p-3 hover-lift"
                style={{
                    width: "200px",
                    height: "300px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    transition: "all 0.2s ease-in-out",
                    borderStyle: "solid",
                    borderColor: isSelected ? "var(--gold)" : "transparent",
                }}
            >
                <div className="ratio ratio-4x3 mb-2">
                    <img
                        src={photoUrl}
                        alt={first}
                        className="w-100 h-100 object-cover rounded-top"
                    />
                </div>

                <div className="card-body p-2">
                    <h6 className="mb-1">{first} {last}</h6>
                    <p className="text-gold small mb-1">{role}</p>
                    <Link
                        to="/OurTeam"
                        state={{ staff: { first, last, role, photoUrl } }}
                        className="btn btn-gold btn-sm"
                    >
                        More Info
                    </Link>
                </div>
            </div>
        );
    }


    // ---- Confirmation screen ----
    if (currentBooking) {
        const b = currentBooking;
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-green-800 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600">Your appointment has been successfully booked.</p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 mt-6 text-left">
                    <div className="space-y-2">
                        <Line k="Service" v={b.service.name} />
                        <Line k="Technician" v={b.staff.name} />
                        <Line k="Date" v={formatDate(b.date)} />
                        <Line k="Time" v={b.time} />
                        <Line k="Payment" v={`${b.payment.method}${b.payment.card ? ` •••• ${b.payment.card.last4}` : ""}`} />
                        <Line k="Subtotal" v={`$${b.totals.service}`} />
                        <Line k="Tip" v={`$${b.totals.tip}`} />
                        <Line k="Total" v={`$${b.totals.total}`} strong />
                    </div>
                </div>

                {smsStatus && <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded">{smsStatus}</div>}

                <div className="flex gap-3 justify-center">
                    <button onClick={() => setCurrentBooking(null)} className="px-4 py-2 border border-pink-600 text-pink-600 rounded-md hover:bg-pink-50">
                        Book Another
                    </button>
                </div>
            </div>
        );
    }

    // ---- Booking form ----
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Book Your Appointment</h2>
                <p className="text-gray-600">Choose a service, specialist, date, time, and payment method</p>
            </div>

            <h3 className="text-lg font-semibold mb-3 ms-3">Choose Your Nail Technician</h3>
            <div className="row gx-3 ps-2 mb-4 ">
                {staff.map((item, i) => (
                    <div
                        key={item.id || i}
                        className={`col-auto ${i === 0 ? "ms-md-4" : ""}`}
                        onClick={() => setSelectedStaff(i)}
                        style={{ cursor: "pointer" }}
                    >
                        <StaffCard {...item} isSelected={selectedStaff === i} />
                    </div>
                ))}
            </div>

            <h3 className="text-lg font-semibold mb-3 ms-3">Select a Service</h3>

            <div className="row g-4 mb-4 ms-3">
                {SERVICES_BY_CATEGORY.map((section) => (
                    <div className="col-12 col-lg-6" key={section.title}>
                        <h5 className="mb-3 ps-1">{section.title}</h5>

                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            {section.items.map((s) => (
                                <div className="col d-flex" key={s.id}>
                                    <ServiceCard
                                        icon={s.icon}
                                        title={s.name}
                                        desc={s.description}
                                        price={s.price}
                                        selected={selectedService?.id === s.id}
                                        onSelect={() => setSelectedService(s)}
                                        actionLabel={selectedService?.id === s.id ? "Selected" : "Select"}
                                        compact
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>


            <h3 className="text-lg font-semibold mb-3 ms-3">Select Date</h3>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="ms-3 w-full price-pill align-self-center mb-4 focus:ring-2 focus:ring-pink-500">
                <option value="">Choose a date</option>
                {getAvailableDates().map(d => <option key={d} value={d}>{new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</option>)}
            </select>

            <h3 className="text-lg font-semibold mb-3 ms-3">Select Time</h3>
            <div className="grid grid-cols-3 mb-4 ms-3">
                {TIME_SLOTS.map(t => (
                    <button key={t} type="button" onClick={() => setSelectedTime(t)}
                        className='price-pill align-self-center'
                        style={{
                    transition: "all 0.2s ease-in-out",
                    borderStyle: "solid",
                    borderColor: selectedTime === t ? "var(--gold)" : "transparent",
                }}>
                        {t}
                    </button>
                ))}
            </div>

            <h3 className="text-lg font-semibold mb-3 ms-3">Payment</h3>
            <div className="flex flex-col gap-4 mb-4 ms-3">
                <div className="flex gap-4 mb-2">
                    <label className={`px-4 py-2 border rounded cursor-pointer ${paymentMethod === "card" ? "border-pink-500 bg-pink-50" : "hover:border-pink-300"}`}>
                        <input type="radio" name="pay" value="card" className="mr-2" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                        Card
                    </label>
                    <label className={`px-4 py-2 border rounded cursor-pointer ${paymentMethod === "cash" ? "border-pink-500 bg-pink-50" : "hover:border-pink-300"}`}>
                        <input type="radio" name="pay" value="cash" className="mr-2" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                        Cash
                    </label>
                </div>

                <div className="grid md:grid-cols-4 gap-2 mb-3">
                    {[0, 5, 10, 15, 20].map(t => (
                        <button key={t} type="button"
                            onClick={() => setTip(String(t))}
                            className='price-pill align-self-center'
                        style={{
                    transition: "all 0.2s ease-in-out",
                    borderStyle: "solid",
                    borderColor: Number(tip) === t ? "var(--gold)" : "transparent",
                }}>
                            Tip ${t}
                        </button>
                    ))}
                    <input className="price-pill align-self-center md:col-span-2" placeholder="Custom tip ($)"
                        value={tip} onChange={(e) => setTip(e.target.value.replace(/[^\d.]/g, ""))} />
                </div>

                {paymentMethod === "card" && (
                    <div className="grid md:grid-cols-2 gap-3">
                        <input className="price-pill align-self-center" placeholder="Name on card" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                        <input className="price-pill align-self-center" placeholder="Card number"
                            value={cardNumber} onChange={(e) => setCardNumber(cleanDigits(e.target.value).slice(0, 19))} />
                        <input className="price-pill align-self-center" placeholder="MM/YY" value={cardExpiry}
                            onChange={(e) => { let v = e.target.value.replace(/[^\d]/g, "").slice(0, 4); if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2); setCardExpiry(v); }} />
                        <input className="price-pill align-self-center" placeholder="CVC"
                            value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                    </div>
                )}
            </div>

            <h3 className="text-lg font-semibold mb-3 ms-3">Your Information</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-3 ms-3">
                <input className="price-pill align-self-center" placeholder="First Name" value={customerInfo.firstName} onChange={e => setCustomerInfo(p => ({ ...p, firstName: e.target.value }))} />
                <input className="price-pill align-self-center" placeholder="Last Name" value={customerInfo.lastName} onChange={e => setCustomerInfo(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-3 ms-3">
                <input className="price-pill align-self-center" placeholder="Email" value={customerInfo.email} onChange={e => setCustomerInfo(p => ({ ...p, email: e.target.value }))} />
                <input className="price-pill align-self-center" placeholder="Phone (+1 xxx-xxx-xxxx)" value={customerInfo.phone} onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <textarea className="w-full price-pill align-self-center mb-3 ms-3" placeholder="Notes (optional)" value={customerInfo.notes} onChange={e => setCustomerInfo(p => ({ ...p, notes: e.target.value }))} />

            <div className="flex justify-between items-center mb-2 text-lg ms-3">
                <span>Estimated total: </span>
                <span className="font-semibold">${total}</span>
            </div>

            <button
                disabled={!isFormValid}
                onClick={handleSubmit}
                className="mb-4 ms-3 w-full price-pill align-self-center hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center"
            >
                {smsStatus ? (<><MessageSquare className="w-5 h-5 mr-2" />{smsStatus}</>) : "Book Now"}
            </button>
        </div>
    );
}

function Line({ k, v, strong }) {
    return (
        <div className="flex justify-between">
            <span className={strong ? "font-bold" : "font-medium"}>{k}:</span>
            <span className={strong ? "font-bold" : ""}>{v}</span>
        </div>
    );
}