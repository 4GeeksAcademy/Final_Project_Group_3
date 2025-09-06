import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, Search, Filter, Trash2, MessageSquare, Star, Scissors, RefreshCw } from "lucide-react";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  "";
const API_ROOT = String(API_BASE).replace(/\/+$/, "");
const LS_KEY = "salonBookings";

// user prop: { id, role: "manager"|"tech", displayName }
export default function AdminDashboard({ onLogout, user }) {
  const [adminViewMode, setAdminViewMode] = useState("month"); // day | week | month
  const [adminCurrentDate, setAdminCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [bookings, setBookings] = useState([]);

  const load = useCallback(() => {
    try { setBookings(JSON.parse(localStorage.getItem(LS_KEY) || "null") || []); }
    catch { setBookings([]); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const onStorage = (e) => { if (e.key === LS_KEY) load(); };
    const onFocus = () => load();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("focus", onFocus); };
  }, [load]);

  const compareByDateTime = (a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    const toMin = (t) => { const [time, p] = t.split(" "); const [h,m]=time.split(":").map(Number); const hh=(p==="PM"? (h%12)+12 : (h%12)); return hh*60+(m||0); };
    return toMin(a.time) - toMin(b.time);
  };

  // Range filter
  const rangeFiltered = useMemo(() => {
    const d = adminCurrentDate;
    let out = [...bookings];
    if (adminViewMode === "day") {
      const dStr = d.toISOString().split("T")[0];
      out = out.filter(b => b.date === dStr);
    } else if (adminViewMode === "week") {
      const start = new Date(d); start.setDate(d.getDate() - d.getDay());
      const end = new Date(start); end.setDate(start.getDate() + 6);
      out = out.filter(b => { const dt = new Date(b.date + "T00:00:00"); return dt >= start && dt <= end; });
    } else {
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth()+1, 0);
      out = out.filter(b => { const dt = new Date(b.date + "T00:00:00"); return dt >= start && dt <= end; });
    }
    return out;
  }, [bookings, adminCurrentDate, adminViewMode]);

  // Role filter: tech sees their own only
  const roleFiltered = useMemo(() => {
    if (user?.role !== "tech") return rangeFiltered;
    const myName = user.displayName; // must match b.staff.name
    return rangeFiltered.filter(b => b?.staff?.name === myName);
  }, [rangeFiltered, user]);

  // Search + status
  const filtered = useMemo(() => {
    let out = [...roleFiltered];
    if (filterStatus !== "all") out = out.filter(b => b.status === filterStatus);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      out = out.filter(b =>
        b.customer.firstName.toLowerCase().includes(t) ||
        b.customer.lastName.toLowerCase().includes(t) ||
        (b.customer.phone || "").toLowerCase().includes(t) ||
        b.service.name.toLowerCase().includes(t) ||
        b.staff.name.toLowerCase().includes(t)
      );
    }
    return out.sort(compareByDateTime);
  }, [roleFiltered, filterStatus, searchTerm]);

  // Totals
  const revenue = filtered.reduce((s,b)=> s + ((b?.totals?.total) ?? (b?.service?.price||0) + (b?.payment?.tip||0)), 0);
  const tipsTotal = filtered.reduce((s,b)=> s + (b?.payment?.tip || 0), 0);

  // Manager: show per-tech weekly revenue (uses week range regardless of current view)
  const managerWeekly = useMemo(() => {
    if (user?.role !== "manager") return null;
    const d = adminCurrentDate;
    const start = new Date(d); start.setDate(d.getDate() - d.getDay());
    const end = new Date(start); end.setDate(start.getDate() + 6);
    const inWeek = bookings.filter(b => {
      const dt = new Date(b.date + "T00:00:00");
      return dt >= start && dt <= end;
    });
    const map = new Map();
    for (const b of inWeek) {
      const tech = b?.staff?.name || "Unknown";
      const amt = (b?.totals?.total) ?? ((b?.service?.price||0) + (b?.payment?.tip||0));
      map.set(tech, (map.get(tech) || 0) + amt);
    }
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]); // [ [tech, amount], ... ]
  }, [bookings, adminCurrentDate, user]);

  const getDateRangeText = () => {
    const d = adminCurrentDate;
    if (adminViewMode === "day")
      return d.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    if (adminViewMode === "week") {
      const start = new Date(d); start.setDate(d.getDate()-d.getDay());
      const end = new Date(start); end.setDate(start.getDate()+6);
      return `${start.toLocaleDateString("en-US",{month:"short",day:"numeric"})} - ${end.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;
    }
    return d.toLocaleDateString("en-US", { year:"numeric", month:"long" });
  };

  const navigateDate = (dir) => {
    const d = new Date(adminCurrentDate);
    if (adminViewMode === "day") d.setDate(d.getDate() + dir);
    else if (adminViewMode === "week") d.setDate(d.getDate() + (dir * 7));
    else d.setMonth(d.getMonth() + dir);
    setAdminCurrentDate(d);
  };

  const save = (arr) => { localStorage.setItem(LS_KEY, JSON.stringify(arr)); setBookings(arr); };
  const updateStatus = (id, status) => { const next = bookings.map(b => b.id === id ? { ...b, status } : b); save(next); };
  const deleteBooking = (id) => { if (window.confirm("Delete this appointment?")) { const next = bookings.filter(b => b.id !== id); save(next); } };

  async function resendSMS(booking) {
    try {
      const res = await fetch(`${API_ROOT}/api/sms/send`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessPhone: "+17864935524", booking })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert("SMS sent.");
    } catch(e) { console.error(e); alert("SMS failed. Check backend."); }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">💅 {user?.role === "manager" ? "Manager" : "Technician"} Dashboard</h2>
          <p className="text-gray-600">{user?.displayName}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Reload
          </button>
          <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Logout</button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {(["day","week","month"]).map(m => (
              <button key={m} onClick={()=>setAdminViewMode(m)} className={`px-4 py-2 rounded-lg capitalize ${adminViewMode===m ? "bg-pink-600 text-white":"bg-gray-200 hover:bg-gray-300"}`}>{m} View</button>
            ))}
          </div>
          <button onClick={()=>setAdminCurrentDate(new Date())} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200">Today</button>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={()=>navigateDate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"><ChevronLeft className="w-5 h-5"/></button>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{getDateRangeText()}</h3>
            <p className="text-sm text-gray-500">{filtered.length} appointment{filtered.length!==1?"s":""}</p>
          </div>
          <button onClick={()=>navigateDate(1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card title={adminViewMode==="day"?"Today":adminViewMode==="week"?"This Week":"This Month"} value={filtered.length} sub="appointments" color="blue" />
        <Card title="Confirmed" value={filtered.filter(b=>b.status==="confirmed").length} sub="appointments" color="green" />
        <Card title="Tips" value={`$${tipsTotal}`} sub="total tips" color="amber" />
        <Card title="Revenue" value={`$${revenue}`} sub={user?.role==="manager" ? "incl. tips (all staff)" : "incl. tips (you)"} color="purple" />
      </div>

      {/* Manager-only: per-tech weekly revenue */}
      {user?.role === "manager" && managerWeekly && (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Weekly revenue by technician</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {managerWeekly.map(([tech, amt]) => (
              <div key={tech} className="border rounded p-3 flex justify-between">
                <span>{tech}</span>
                <span className="font-semibold">${amt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search appointments..." value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" autoComplete="off" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b"><h3 className="font-semibold">Appointments ({filtered.length})</h3></div>
        {filtered.length===0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No appointments found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(booking => (
              <div key={booking.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{booking.customer.firstName} {booking.customer.lastName}</h4>
                    <div className="text-sm text-gray-600 flex items-center gap-4">
                      <span>📧 {booking.customer.email}</span>
                      <span>📱 {(booking.customer.phone||"").trim()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600 mb-2">
                      ${booking?.totals?.total ?? ((booking?.service?.price||0) + (booking?.payment?.tip||0))}
                    </div>
                    <select value={booking.status} onChange={(e)=>updateStatus(booking.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs border-0 ${
                        booking.status==="confirmed" ? "bg-green-100 text-green-800" :
                        booking.status==="pending" ? "bg-yellow-100 text-yellow-800" :
                        booking.status==="cancelled" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"}`}>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm mb-3">
                  <Row icon={<Calendar className="w-4 h-4 text-gray-400 mr-2" />} label="Date" value={new Date(booking.date+"T00:00:00").toLocaleDateString("en-US",{weekday:"long", month:"long", day:"numeric", year:"numeric"})} />
                  <Row icon={<Clock className="w-4 h-4 text-gray-400 mr-2" />} label="Time" value={booking.time} />
                  <Row icon={<Scissors className="w-4 h-4 text-gray-400 mr-2" />} label="Service" value={booking.service.name} />
                  <Row icon={<Star className="w-4 h-4 text-gray-400 mr-2" />} label="Technician" value={booking.staff.name} />
                  <Row label="Payment" value={`${booking?.payment?.method || "—"}${booking?.payment?.card?.last4 ? ` •••• ${booking.payment.card.last4}`:""}`} />
                </div>

                <div className="text-sm text-gray-600 mb-2">Tip: ${booking?.payment?.tip || 0}</div>

                {booking.customer.notes && (
                  <div className="text-sm bg-gray-100 p-2 rounded mb-3">
                    <span className="font-medium">Notes:</span> {booking.customer.notes}
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={()=>resendSMS(booking)} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200">
                    <MessageSquare className="w-4 h-4 inline mr-1" />Send SMS
                  </button>
                  {user?.role === "manager" && (
                    <button onClick={()=>deleteBooking(booking.id)} className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200">
                      <Trash2 className="w-4 h-4 inline mr-1" />Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, sub, color }) {
  const colors = {
    blue:   "bg-blue-50 border-blue-200 text-blue-800",
    green:  "bg-green-50 border-green-200 text-green-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    amber:  "bg-amber-50 border-amber-200 text-amber-800",
  }[color] || "bg-gray-50 border-gray-200 text-gray-800";
  return (
    <div className={`${colors} border rounded-lg p-4`}>
      <h3 className="font-semibold">{title}</h3>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-80">{sub}</div>
    </div>
  );
}
function Row({ icon, label, value }) {
  return (
    <div className="flex items-center">
      {icon || null}
      <div>
        <span className="font-medium">{label}:</span>
        <div>{value}</div>
      </div>
    </div>
  );
}
