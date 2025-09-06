import React, { useState } from "react";
import { findUser } from "../auth/users";

export default function StaffLogin({ onCancel, onSuccess }) {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [err, setErr] = useState("");

    function submit() {
        const user = findUser(email, pwd);
        if (!user) { setErr("Invalid email or password."); return; }
        localStorage.setItem("salonUser", JSON.stringify(user));
        onSuccess?.(user);
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white border rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2 text-center">Staff Login</h2>
            <p className="text-gray-600 mb-6 text-center">Manager or Technician</p>

            <input
                type="email" placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-pink-500 mb-3"
            />
            <input
                type="password" placeholder="Password"
                value={pwd} onChange={(e) => setPwd(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-pink-500"
            />
            {err && <div className="text-red-600 text-sm mt-2">{err}</div>}

            <div className="flex gap-2 mt-5">
                <button onClick={submit} className="flex-1 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
                    Sign in
                </button>
                <button onClick={onCancel} className="flex-1 py-2 border border-pink-600 text-pink-600 rounded-md hover:bg-pink-50">
                    Cancel
                </button>
            </div>

            <div className="text-xs text-gray-500 mt-4">
                <div><b>Manager:</b> manager@glamour.com / secret123</div>
                <div><b>Tech:</b> maria@glamour.com / maria123 (and others in users.js)</div>
            </div>
        </div>
    );
}
