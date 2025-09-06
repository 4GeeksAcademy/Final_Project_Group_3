import React, { useState } from "react";

export default function AdminLogin({ onCancel, onSuccess }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    if (pwd === "123456") {
      setErr("");
      onSuccess?.();
    } else {
      setErr("Incorrect password.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-2 text-center">Admin Access</h2>
      <p className="text-gray-600 mb-6 text-center">Enter password to view bookings</p>
      <input
        type="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Password (123456)"
        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-pink-500"
        autoFocus
      />
      {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
      <div className="flex gap-2 mt-5">
        <button
          className="flex-1 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          onClick={submit}
        >
          Enter
        </button>
        <button
          className="flex-1 py-2 border border-pink-600 text-pink-600 rounded-md hover:bg-pink-50"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
