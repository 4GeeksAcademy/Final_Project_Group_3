import { useEffect, useState } from "react";

export const InfoTab = () => {

    {/* add edit functionality (PUT) */ }
    {/* add placeholders from account (GET) */ }

    {/* placeholder values */ }
    const [form, setForm] = useState({
        first: "Loading...",
        last: "Loading...",
        email: "Loading...",
        phone: "Loading..."
    });

    {/* Runs backend function "getMe" to get the current user via the token */ }
    // async function getMe() {
    //     try {
    //         const res = await fetch("https://curly-space-doodle-v6wjv49jxxp62px57-3001.app.github.dev/api/me", {
    //             headers: {
    //                 "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
    //             }
    //         });
    //         if (!res.ok) throw new Error("Failed to fetch user");
    //         const data = await res.json();
    //         setForm({
    //             first: data.fname,
    //             last: data.lname,
    //             email: data.email,
    //             phone: data.phone
    //         });
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    async function getMe() {
        try {
            const userId = localStorage.getItem("user-id");
            {/* dynamic links in frontend fetches | use import.meta.env.VITE_BACKEND_URL, plug via variable */}
            {/* const backendLink = import.meta.env.VITE_BACKEND_URL */}
            const res = await fetch(`https://curly-space-doodle-v6wjv49jxxp62px57-3001.app.github.dev/api/me/${userId}`, {
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
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getMe();
    }, []);



    return (
        <div>
            <div className="">
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
                            <button className="btn btn-gold ms-2 me-5">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoTab