import { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
    const [emailInputValue, setEmailInputValue] = useState("");
    const [passwordInputValue, setPasswordInputValue] = useState("");

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
        localStorage.setItem("jwt-token", data.token);

        return data
    }

    return (
        <div>
            <div className="d-flex display-items-center justify-content-center">
                <div className="container">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <div className="border border-1 border-secondary rounded p-3 d-flex justify-content-center align-items-center" style={{ height: "70vh", boxSizing: "border-box" }}>
                                <div>
                                    <h1 className="mx-auto">Log in!</h1>
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
                                        <Link to="/" className="btn btn-secondary ms-2 text-decoration-none">
                                            Cancel
                                        </Link>
                                        <button type="text" onClick={() => login(emailInputValue, passwordInputValue)} className="btn btn-success ms-2 text-decoration-none">
                                            Log in!
                                        </button>
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