import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
    const [emailInputValue, setEmailInputValue] = useState("");
    const [passwordInputValue, setPasswordInputValue] = useState("");

    const { authLogin } = useAuth();

    const login = async (email, password) => {
        const backendLink = import.meta.env.VITE_BACKEND_URL
        const resp = await fetch(`${backendLink}/api/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        if (!resp.ok) throw Error("There was a problem in the login request")

        if (resp.status === 401) {
            throw ("Invalid credentials")
        }
        else if (resp.status === 400) {
            throw ("Invalid email or password format")
        }
        const data = await resp.json()

        {/* changed from localStorage.setItem, this lets me re-render navbar in real time */ }
        authLogin(data.token, data.user_id);

        return data
    }

    const handleLogin = async () => {
        try {
            await login(emailInputValue, passwordInputValue);
            window.location.href = "/";
        } catch (error) {
            console.error(error);
            // optionally show user error message here
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1 className="auth-title">Log in!</h1>

                <div className="mb-3">
                    <input
                        className="form-control form-control-lg"
                        placeholder="email"
                        value={emailInputValue}
                        onChange={(event) => setEmailInputValue(event.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <input
                        className="form-control form-control-lg"
                        type="password"
                        placeholder="password"
                        value={passwordInputValue}
                        onChange={(event) => setPasswordInputValue(event.target.value)}
                    />
                </div>

                <div className="stack-sm mt-3">
                    <Link to="/" className="btn btn-secondary">Cancel</Link>
                    <button
                        type="button"
                        className="btn btn-gold"
                        onClick={() => handleLogin(emailInputValue, passwordInputValue)}
                    >
                        Log in!
                    </button>
                </div>

                <p className="mt-3 text-center small">
                    Don’t have an account?{" "}
                    <Link to="/Signup" className="link-gold">Sign up</Link>.
                </p>
            </div>
        </div>
    )
}