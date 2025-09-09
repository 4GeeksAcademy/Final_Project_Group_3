import React, { useEffect, useState } from "react";
import CustomerBooking from "../components/CustomerBooking.jsx";
import AdminDashboard from "../components/AdminDashboard.jsx";
import StaffLogin from "../components/StaffLogin.jsx";

export default function BookingApp() {
    const [view, setView] = useState("booking"); // booking | login | admin
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("salonUser");
        if (saved) setUser(JSON.parse(saved));
    }, []);

    const toLogin = () => setView(user ? "admin" : "login");
    const logout = () => {
        localStorage.removeItem("salonUser");
        setUser(null);
        setView("booking");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <nav className="bg-pink-600 text-white">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            className={`price-pill align-self-center ${view === "booking" ? "bg-pink-700" : "hover:bg-pink-700"}`}
                            onClick={() => setView("booking")}
                        >
                            Booking
                        </button>
                        <button
                            className={`price-pill align-self-center ${view === "login" || view === "admin" ? "bg-pink-700" : "hover:bg-pink-700"}`}
                            onClick={toLogin}
                        >
                            Staff Login
                        </button>
                    </div>
                </div>
            </nav> */}

            {view === "booking" && <CustomerBooking />}

            {view === "login" && !user && (
                <StaffLogin
                    onCancel={() => setView("booking")}
                    onSuccess={(u) => { setUser(u); setView("admin"); }}
                />
            )}

            {view === "admin" && user && (
                <AdminDashboard user={user} onLogout={logout} />
            )}
        </div>
    );
}
