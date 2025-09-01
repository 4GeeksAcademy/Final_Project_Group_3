import { useEffect, useState } from "react";
import UserEditToast from "./UserEditToast";

export const InfoTab = () => {
    // toast (success message)
    const [showToast, setShowToast] = useState(false);

    // placeholder values
    const [form, setForm] = useState({
        first: "Loading...",
        last: "Loading...",
        email: "Loading...",
        phone: "Loading..."
    });

    async function getMe() {
        try {
            const userId = localStorage.getItem("user-id");
            {/* dynamic links in frontend fetches | use import.meta.env.VITE_BACKEND_URL, plug via variable */ }
            const backendLink = import.meta.env.VITE_BACKEND_URL
            const res = await fetch(`${backendLink}/api/me/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch user");
            const data = await res.json();
            setForm({
                first: data.first,
                last: data.last,
                email: data.email,
                phone: data.phone
            });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error(err);
        }
    }

    const editMe = async () => {
        try {
            const backendLink = import.meta.env.VITE_BACKEND_URL;
            const userId = localStorage.getItem("user-id");

            const res = await fetch(`${backendLink}/api/user/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first: form.first,
                    last: form.last,
                    email: form.email,
                    phone: form.phone
                })
            });

            if (!res.ok) throw new Error("Failed to update user");
            const data = await res.json();
            console.log("Updated user:", data);

            // update form with latest server response
            setForm({
                first: data.first,
                last: data.last,
                email: data.email,
                phone: data.phone
            });
        } catch (err) {
            console.error("PUT failed:", err);
        }
    };

    useEffect(() => {
        getMe();
    }, []);



    return (
        <div>
            <UserEditToast show={showToast} onClose={() => setShowToast(false)} message="Profile updated!" />
            <div className="border border-1 border-secondary rounded">
                <div className="row px-5 pb-5 pt-3">
                    <div className="col-6">
                        <div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="changemeid1">First Name</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.first}
                                    onChange={(e) => setForm({ ...form, first: e.target.value })}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="changemeid2">Last Name</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.last}
                                    onChange={(e) => setForm({ ...form, last: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="changemeid3">E-Mail</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="changemeid4">Phone #</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="ms-auto">
                            <button className="btn btn-secondary">Cancel</button>
                            <button className="btn btn-gold ms-2 me-5" onClick={editMe}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoTab