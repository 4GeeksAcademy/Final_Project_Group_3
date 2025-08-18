import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
    const [emailInputValue, setEmailInputValue] = useState("");
    const [passwordInputValue, setPasswordInputValue] = useState("");

    const { authLogin } = useAuth();

    const login = async (email, password) => {
        const resp = await fetch(`https://curly-space-doodle-v6wjv49jxxp62px57-3001.app.github.dev/api/token`, {
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
        authLogin(data.token);

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
        <div>
            <div className="d-flex display-items-center justify-content-center">
                <div className="container">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8 d-flex justify-content-center">
                            <div className="border border-1 border-secondary rounded p-3 d-flex justify-content-center align-items-center mt-5 mb-5" style={{ height: "65vh", width: "30vw", boxSizing: "border-box" }}>
                                <div className="d-flex flex-column align-items-center justify-content-center">
                                    <h1 className="mx-auto mb-3">Log in!</h1>
                                    <div>
                                        <input
                                            className="form-control border-1 border-secondary focus-ring-0 m-1"
                                            value={emailInputValue}
                                            placeholder="email"
                                            onChange={(event) => setEmailInputValue(event.target.value)}
                                        />{/* onKeyDown={(event) => postTodo(event)} - change this to throw an error if both fields are not full */}
                                        <input
                                            className="form-control border-1 border-secondary focus-ring-0 m-1"
                                            value={passwordInputValue}
                                            placeholder="password"
                                            onChange={(event) => setPasswordInputValue(event.target.value)}
                                        />{/* onKeyDown={(event) => postTodo(event)} - change this to throw an error if both fields are not full */}
                                        <div className="d-flex justify-content-center align-items-center mt-4 mb-3">
                                            <Link to="/" className="btn btn-secondary ms-2 text-decoration-none">
                                                Cancel
                                            </Link>
                                            <button type="text" onClick={() => handleLogin(emailInputValue, passwordInputValue)} className="btn btn-gold ms-2 text-decoration-none">
                                                Log in!
                                            </button>
                                        </div>
                                        <span>Don't have an account? <a href="/Signup" className="text-gold">Sign up.</a></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}