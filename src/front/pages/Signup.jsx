import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

{/* Navigate is NOT working... */ }

export const Signup = () => {
    const [fNameInputValue, setFNameInputValue] = useState("");
    const [lNameInputValue, setLNameInputValue] = useState("");
    const [emailInputValue, setEmailInputValue] = useState("");
    const [passwordInputValue, setPasswordInputValue] = useState("");
    const [phoneInputValue, setPhoneInputValue] = useState("");
    const navigate = useNavigate();

    const createUser = async (e) => {
        e.preventDefault();
        let data = {
            email: emailInputValue,
            password: passwordInputValue,
            phone: phoneInputValue,
            first: fNameInputValue,
            last: lNameInputValue
        };

        try {
            const res = await fetch('https://curly-space-doodle-v6wjv49jxxp62px57-3001.app.github.dev/api/user', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) throw new Error(res.statusText);

            const response = await res.json();
            console.log('Success:', response);
            console.log("Navigating now")
            navigate("/");

        } catch (error) {
            console.error(error);
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
                                    <h1 className="mx-auto mb-3">Sign Up!</h1>
                                    <form onSubmit={createUser}>
                                        <input
                                            className="form-control border-1 border-secondary focus-ring-0 m-1"
                                            value={fNameInputValue}
                                            placeholder="First Name"
                                            onChange={(event) => setFNameInputValue(event.target.value)}
                                        />
                                        <input
                                            className="form-control border-1 border-secondary focus-ring-0 m-1"
                                            value={lNameInputValue}
                                            placeholder="Last Name"
                                            onChange={(event) => setLNameInputValue(event.target.value)}
                                        />
                                        <input
                                            className="form-control border-1 border-secondary focus-ring-0 m-1"
                                            value={emailInputValue}
                                            placeholder="E-Mail"
                                            onChange={(event) => setEmailInputValue(event.target.value)}
                                        />{/* onKeyDown={(event) => postTodo(event)} - change this to throw an error if both fields are not full */}
                                        <input
                                            className="form-control border-1 border-secondary focus-ring-0 m-1"
                                            value={phoneInputValue}
                                            placeholder="Phone #"
                                            onChange={(event) => setPhoneInputValue(event.target.value)}
                                        />
                                        <input
                                            className="form-control border-1 border-secondary focus-ring-0 m-1"
                                            value={passwordInputValue}
                                            placeholder="Password"
                                            onChange={(event) => setPasswordInputValue(event.target.value)}
                                        />{/* onKeyDown={(event) => postTodo(event)} - change this to throw an error if both fields are not full */}
                                        <div className="d-flex justify-content-center align-items-center mt-4 mb-3">
                                            <Link to="/" className="btn btn-secondary me-2 text-decoration-none">
                                                Cancel
                                            </Link>
                                            <button type="submit" className="btn btn-gold ms-2 text-decoration-none">
                                                Sign up!
                                            </button>
                                        </div>
                                        <span>Already have an account? <a href="/Login" className="text-gold">Log in.</a></span>
                                    </form>
                                    {/* put link to send signup token here, and onclick (onsubmit?) */}
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