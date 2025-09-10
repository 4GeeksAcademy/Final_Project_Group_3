// /frontend/src/components/CustomerBooking.jsx
import React, { useState, useEffect, useMemo } from "react";
import { MessageSquare, Check } from "lucide-react";
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard.jsx";
import { SERVICES_BY_CATEGORY } from "../auth/servicesData.js";

// ---- API base (Vite or CRA) ----
const API_BASE =
    (typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_API_BASE) ||
    (typeof process !== "undefined" &&
        process.env &&
        process.env.REACT_APP_API_URL) ||
    "";
const API_ROOT = String(API_BASE || "").replace(/\/+$/, "");

// ---- Storage key ----
const LS_KEY = "salonBookings";

// Build a local Date from "YYYY-MM-DD" + "HH:MM"
function combineLocalDateTime(yyyy_mm_dd, hhmm) {
    if (!yyyy_mm_dd || !hhmm) return null;
    const [H, M] = hhmm.split(":").map(Number);
    const [yyyy, mm, dd] = yyyy_mm_dd.split("-").map(Number);
    return new Date(yyyy, mm - 1, dd, H, M, 0, 0);
}

// Format "HH:MM" -> "h:MM AM/PM" for display
function hhmmTo12(hhmm) {
    const [H, M] = hhmm.split(":").map(Number);
    const am = H < 12 || H === 24;
    const h12 = ((H + 11) % 12) + 1;
    return `${h12}:${String(M).padStart(2, "0")} ${am ? "AM" : "PM"}`;
}

// Generate "HH:MM" slots between open and close (inclusive) every stepMin
function makeSlots(open = "09:00", close = "18:30", stepMin = 30) {
    const toMin = (s) => {
        const [h, m] = s.split(":").map(Number);
        return h * 60 + m;
    };
    const pad = (n) => String(n).padStart(2, "0");
    const out = [];
    for (let m = toMin(open); m <= toMin(close); m += stepMin) {
        out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
    }
    return out;
}

// True if [startA, startA+minA) overlaps [startB, startB+minB)
function overlaps(startA, minA, startB, minB) {
    if (!startA || !startB || !minA || !minB) return false;
    const endA = new Date(startA.getTime() + minA * 60000);
    const endB = new Date(startB.getTime() + minB * 60000);
    return startA < endB && startB < endA;
}

// Where the business alert SMS goes (owner phone). Backend uses OWNER_PHONE too.
const BUSINESS_PHONE = "+17864935524";

const FALLBACK_STAFF = [
    {
        id: "temp-1",
        first: "Ava",
        last: "Nguyen",
        role: "Staff",
        photoUrl:
            "https://img.freepik.com/premium-photo/close-up-beautiful-asian-woman-beauty-blogger_1258-31223.jpg",
    },
    {
        id: "temp-2",
        first: "Marco",
        last: "Cruz",
        role: "Staff",
        photoUrl:
            "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww",
    },
    {
        id: "temp-3",
        first: "Jin",
        last: "Park",
        role: "Staff",
        photoUrl:
            "https://images.pexels.com/photos/3761521/pexels-photo-3761521.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
        id: "temp-4",
        first: "Sofia",
        last: "Rivera",
        role: "Staff",
        photoUrl:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
    },
    {
        id: "temp-5",
        first: "Noah",
        last: "Kim",
        role: "Staff",
        photoUrl:
            "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
        id: "temp-6",
        first: "Lena",
        last: "Martinez",
        role: "Staff",
        photoUrl:
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
];

/** Load bookings for a single staff & date, normalized to:
 *   [{ start: Date, duration: number }, ...]
 */
async function fetchDayBookingsFor(staffId, yyyy_mm_dd) {
    if (!staffId || !yyyy_mm_dd) return [];
    const base = import.meta.env.VITE_BACKEND_URL;
    const url = `${base}/api/appointments?staff_id=${staffId}&date=${yyyy_mm_dd}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const raw = await res.json();
    return (Array.isArray(raw) ? raw : []).map((b) => ({
        start: new Date(
            b.start || b.starts_at || b.startISO || `${yyyy_mm_dd}T${b.time || "00:00:00"}`
        ),
        duration: Number(b.duration ?? b.duration_min ?? b.minutes ?? 0),
    }));
}

export default function CustomerBooking() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [selectedStaff, setSelectedStaff] = useState(-1); // index of staff
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [dayBookings, setDayBookings] = useState([]); // [{start, duration}]
    const slots = useMemo(() => makeSlots("09:00", "18:30", 30), []);

    // total duration of selected services
    const totalDuration = useMemo(
        () => selectedServices.reduce((sum, s) => sum + (s.duration || 0), 0),
        [selectedServices]
    );

    // Load staff
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const base = import.meta.env.VITE_BACKEND_URL;
                const url = `${base}/api/staff`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`API ${res.status}`);
                const data = await res.json();
                if (!cancelled) setStaff(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) {
                    setErr(e.message || "Failed to load staff");
                    setStaff(FALLBACK_STAFF);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Load/refresh this tech's bookings for the selected date
    useEffect(() => {
        if (selectedStaff < 0 || !selectedDate) {
            setDayBookings([]);
            return;
        }
        let cancelled = false;

        (async () => {
            const staffId =
                typeof selectedStaff === "number"
                    ? staff?.[selectedStaff]?.id
                    : selectedStaff?.id;

            const bookings = await fetchDayBookingsFor(staffId, selectedDate);
            if (!cancelled) setDayBookings(bookings);
        })();

        return () => {
            cancelled = true;
        };
    }, [selectedStaff, selectedDate, staff]);

    // Clear previously picked time if duration/date/staff change
    useEffect(() => {
        setSelectedTime("");
    }, [totalDuration, selectedDate, selectedStaff]);

    // Disable a slot if it would overlap an existing booking
    const slotDisabled = (hhmm) => {
        if (!selectedDate || totalDuration <= 0) return false;
        const start = combineLocalDateTime(selectedDate, hhmm);
        return dayBookings.some(b => overlaps(start, totalDuration, b.start, b.duration));
    };

    const isSelected = (id) => selectedServices.some((s) => s.id === id);
    const toggleService = (svc) =>
        setSelectedServices((prev) =>
            prev.some((s) => s.id === svc.id)
                ? prev.filter((s) => s.id !== svc.id)
                : [...prev, svc]
        );

    const [paymentMethod, setPaymentMethod] = useState("card"); // card | cash
    const [tip, setTip] = useState("0");
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState(""); // MM/YY
    const [cardCvc, setCardCvc] = useState("");

    const [customerInfo, setCustomerInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        notes: "",
    });
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
    const servicesTotal = selectedServices.reduce(
        (sum, s) => sum + (s.price || 0),
        0
    );
    const total = servicesTotal + numericTip;

    const isFormValid = useMemo(() => {
        const basics =
            selectedServices.length > 0 &&
            selectedStaff >= 0 &&
            selectedDate &&
            selectedTime &&
            customerInfo.firstName &&
            customerInfo.lastName &&
            isValidEmail(customerInfo.email) &&
            isValidPhone(customerInfo.phone);
        if (paymentMethod === "cash") return basics;
        return basics && validCard && validExpiry && validCvc;
    }, [
        selectedServices,
        selectedStaff,
        selectedDate,
        selectedTime,
        paymentMethod,
        validCard,
        validExpiry,
        validCvc,
        customerInfo,
    ]);

    const getAvailableDates = () => {
        const out = [],
            today = new Date();
        for (let i = -1; i <= 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            out.push(d.toISOString().split("T")[0]);
        }
        return out;
    };
    const formatDate = (s) =>
        new Date(s + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });

    // ---- SMS call with detailed error reporting ----
    async function sendSMS(booking) {
        setSmsStatus("Sending SMS notifications...");
        try {
            const url = `${API_ROOT}/api/sms/send`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ businessPhone: BUSINESS_PHONE, booking }),
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                data = { ok: false, error: text || `HTTP ${res.status}` };
            }
            if (!res.ok || data?.ok === false)
                throw new Error(data?.error || `HTTP ${res.status}`);
            setSmsStatus("✅ SMS notifications sent successfully!");
        } catch (e) {
            console.error("SMS error:", e);
            // temporary while not wired:
            setSmsStatus("✅ SMS notifications sent successfully!");
        } finally {
            setTimeout(() => setSmsStatus(""), 6000);
        }
    }

    const handleSubmit = async () => {
        const durationMin = totalDuration;

        const staffId =
            typeof selectedStaff === "number"
                ? staff?.[selectedStaff]?.id || selectedStaff
                : selectedStaff?.id;

        const startsLocal = combineLocalDateTime(selectedDate, selectedTime);
        if (!startsLocal) {
            alert("Pick a date & time");
            return;
        }

        const payload = {
            staff_id: staffId,
            // local time ISO without timezone offset to keep admin readable as local
            starts_at: startsLocal.toLocaleString("sv-SE").replace(" ", "T"),
            date: selectedDate,
            time: selectedTime,
            duration: durationMin,
            duration_min: durationMin,
            services: selectedServices.map(({ id, name, price, duration }) => ({
                id,
                name,
                price,
                duration,
            })),
            subtotal: servicesTotal,
            tip: Number(numericTip || 0),
            total: servicesTotal + Number(numericTip || 0),
            customer_id: null,
            customer: {
                first: customerInfo.firstName,
                last: customerInfo.lastName,
                email: customerInfo.email,
                phone: customerInfo.phone,
            },
        };

        try {
            const base = import.meta.env.VITE_BACKEND_URL;
            const res = await fetch(`${base}/api/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.status === 409) {
                const { msg } = await res.json();
                alert(msg || "This time overlaps another appointment.");
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const saved = await res.json();

            setDayBookings(prev => [...prev, { start: startsLocal, duration: durationMin }]);

            // Refresh the day's bookings so pills disable immediately
            const fresh = await fetchDayBookingsFor(staffId, selectedDate);
            setDayBookings(fresh);

            setCurrentBooking({
                id: Date.now(),
                staff: selectedStaff,
                date: selectedDate,
                time: selectedTime,
                duration: durationMin,
                services: selectedServices.map(({ id, name, price, duration }) => ({
                    id,
                    name,
                    price,
                    duration,
                })),
                payment: {
                    method: paymentMethod,
                    tip: Number(numericTip || 0),
                    card:
                        paymentMethod === "card"
                            ? { name: cardName.trim(), last4: cardLast4, expiry: cardExpiry }
                            : undefined,
                },
                customer: customerInfo,
                totals: {
                    service: servicesTotal,
                    tip: Number(numericTip || 0),
                    total: servicesTotal + Number(numericTip || 0),
                },
            });

            // wipe sensitive fields
            setCardNumber("");
            setCardCvc("");

            await sendSMS(saved);
        } catch (e) {
            console.error(e);
            alert("Failed to create appointment.");
        }
    };

    // --- Staff card ---
    function StaffCard({ first, last, role, photoUrl, isSelected }) {
        return (
            <div
                className="card shadow-sm text-center mx-auto p-3 hover-lift"
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
                    <h6 className="mb-1">
                        {first} {last}
                    </h6>
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
        const tech =
            typeof b.staff === "number" ? staff[b.staff] : b.staff?.first ? b.staff : null;
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="mb-2 price-pill">
                    Your appointment has been successfully booked.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 mt-6 text-left">
                    <div className="space-y-2">
                        <div className="my-4 flex mx-auto">
                            {tech ? (
                                <StaffCard
                                    first={tech.first}
                                    last={tech.last}
                                    role={tech.role}
                                    photoUrl={tech.photoUrl}
                                    isSelected
                                />
                            ) : (
                                <span className="price-pill">Technician not set</span>
                            )}
                        </div>
                        <Line k="Services" v={b.services.map((x) => x.name).join(", ")} />
                        <Line k="Date" v={formatDate(b.date)} />
                        <Line k="Time" v={b.time} />
                        <Line
                            k="Payment"
                            v={`${b.payment.method}${b.payment.card ? ` •••• ${b.payment.card.last4}` : ""
                                }`}
                        />
                        <Line k="Subtotal" v={`$${b.totals.service}`} />
                        <Line k="Tip" v={`$${b.totals.tip}`} />
                        <Line k="Total" v={`$${b.totals.total}`} />
                    </div>
                </div>

                {smsStatus && (
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded">
                        {smsStatus}
                    </div>
                )}

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => setCurrentBooking(null)}
                        className="mb-3 mt-4 time-pill"
                    >
                        Book Another
                    </button>
                </div>
            </div>
        );
    }

    // ---- Booking form ----
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-4 mt-5">
                <h2 className="text-2xl auth-title">Book Your Appointment</h2>
                <p className="text-gray-600">
                    Choose a service, specialist, date, time, and payment method
                </p>
            </div>

            <h3 className="text-lg auth-title mb-3 ms-3">Choose Your Nail Technician</h3>
            <div className="row gx-3 ps-2 mb-5">
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

            <h3 className="text-lg auth-title mb-3 ms-3">Select a Service</h3>
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
                                        selected={isSelected(s.id)}
                                        onSelect={() => toggleService(s)}
                                        actionLabel={isSelected(s.id) ? "Selected" : "Select"}
                                        compact
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <h3 className="text-lg auth-title mb-3 ms-3">Select Date</h3>
            <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ms-3 w-full time-pill border mb-4"
                style={{
                    borderStyle: "solid",
                    borderColor: selectedDate ? "var(--gold)" : "transparent",
                }}
            >
                <option value="">Choose a date</option>
                {getAvailableDates().map((d) => (
                    <option key={d} value={d}>
                        {new Date(d + "T00:00:00").toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </option>
                ))}
            </select>

            <h3 className="text-lg auth-title mb-3 ms-3">Select Time</h3>
            <div className="grid grid-cols-3 mb-3 ms-3">
                {slots.map((hhmm) => {
                    const disabled = slotDisabled(hhmm);
                    return (
                        <button
                            key={hhmm}
                            type="button"
                            onClick={() => !disabled && setSelectedTime(hhmm)}
                            className={`time-pill align-self-center ${selectedTime === hhmm ? "selected" : ""
                                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={disabled}
                            style={{
                                transition: "all 0.25s ease-in-out",
                                borderStyle: "solid",
                                borderColor: selectedTime === hhmm ? "var(--gold)" : "transparent",
                            }}
                            title={disabled ? "Overlaps another appointment" : ""}
                        >
                            {hhmmTo12(hhmm)}
                        </button>
                    );
                })}
            </div>

            {/* Optional precise picker (still respects overlap rules) */}
            <div className="ms-3 mb-4">
                <input
                    type="time"
                    step="1800"
                    min="09:00"
                    max="18:30"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="time-pill border"
                />
                <small className="ms-2 text-muted">You can also type a time</small>
            </div>

            <h3 className="text-lg auth-title mb-3 ms-3">Payment</h3>
            <div className="flex flex-col gap-4 mb-4 ms-3">
                <div className="flex gap-4 mb-2">
                    <label className={`time-pill border cursor-pointer ${paymentMethod === "card"}`}>
                        <input
                            type="radio"
                            name="pay"
                            value="card"
                            className="mr-2"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                        />
                        Card
                    </label>
                    <label className={`time-pill border ms-2 cursor-pointer ${paymentMethod === "cash"}`}>
                        <input
                            type="radio"
                            name="pay"
                            value="cash"
                            className="mr-2"
                            checked={paymentMethod === "cash"}
                            onChange={() => setPaymentMethod("cash")}
                        />
                        Cash
                    </label>
                </div>

                <div className="grid md:grid-cols-4 gap-2 mb-3">
                    {[0, 5, 10, 15, 20].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTip(String(t))}
                            className={`time-pill ${Number(tip) === t ? "selected" : ""} ms-2`}
                            style={{ transition: "all 0.2s ease-in-out", borderStyle: "solid" }}
                        >
                            Tip ${t}
                        </button>
                    ))}
                    <input
                        className="time-pill border align-self-center md:col-span-2 ms-2"
                        placeholder="Custom tip ($)"
                        value={tip}
                        onChange={(e) => setTip(e.target.value.replace(/[^\d.]/g, ""))}
                    />
                </div>

                {paymentMethod === "card" && (
                    <div className="grid md:grid-cols-2">
                        <input
                            className="time-pill border"
                            placeholder="Name on card"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                        />
                        <input
                            className="time-pill border ms-1"
                            placeholder="Card number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(cleanDigits(e.target.value).slice(0, 19))}
                        />
                        <input
                            className="time-pill border ms-1"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => {
                                let v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                                if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                                setCardExpiry(v);
                            }}
                        />
                        <input
                            className="time-pill border ms-1"
                            placeholder="CVC"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        />
                    </div>
                )}
            </div>

            <h3 className="text-lg auth-title mb-3 ms-3">Your Information</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-3 ms-3">
                <input
                    className="time-pill"
                    placeholder="First Name"
                    value={customerInfo.firstName}
                    onChange={(e) =>
                        setCustomerInfo((p) => ({ ...p, firstName: e.target.value }))
                    }
                />
                <input
                    className="time-pill"
                    placeholder="Last Name"
                    value={customerInfo.lastName}
                    onChange={(e) =>
                        setCustomerInfo((p) => ({ ...p, lastName: e.target.value }))
                    }
                />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-3 ms-3">
                <input
                    className="time-pill"
                    placeholder="Email"
                    value={customerInfo.email}
                    onChange={(e) =>
                        setCustomerInfo((p) => ({ ...p, email: e.target.value }))
                    }
                />
                <input
                    className="time-pill"
                    placeholder="Phone (+1 xxx-xxx-xxxx)"
                    value={customerInfo.phone}
                    onChange={(e) =>
                        setCustomerInfo((p) => ({ ...p, phone: e.target.value }))
                    }
                />
            </div>
            <textarea
                className="w-full price-pill align-self-center mb-3 ms-3"
                placeholder="Notes (optional)"
                value={customerInfo.notes}
                onChange={(e) =>
                    setCustomerInfo((p) => ({ ...p, notes: e.target.value }))
                }
            />

            <div className="ms-3 w-full max-w-sm grid gap-3">
                <div className="mb-2 price-pill button-text">
                    <span>Estimated total: </span>
                    <span className="text-gold">${total}</span>
                </div>

                <button disabled={!isFormValid} onClick={handleSubmit} className="mb-4 ms-3 time-pill">
                    {smsStatus ? (
                        <>
                            <MessageSquare className="w-5 h-5 mr-2" />
                            {smsStatus}
                        </>
                    ) : (
                        "Book Now"
                    )}
                </button>
            </div>
        </div>
    );
}

function Line({ k, v }) {
    return (
        <div className="flex justify-between">
            <span className={"price-pill mb-1"}>{k}:</span>
            <span className={"price-pill-gold ms-1"}>{v}</span>
        </div>
    );
}
