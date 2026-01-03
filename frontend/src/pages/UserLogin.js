import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

            const res = await fetch(`${backendUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);

            history.push("/user/dashboard");
        } catch (err) {
            setError(err.message);
            console.log("Error:", err);
        }
    };

    return (
        <div className="userLogin">
            <section className="py-5">
                <div className="container-small">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Job Seeker Login</h2>
                        </div>
                        <div className="card-body">
                            {error && <p className="error">{error}</p>}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button className="btn btn-primary btn-block btn-large">
                                    Login
                                </button>
                            </form>

                            <div className="divider"></div>

                            <p className="text-center text-muted">
                                Don't have an account?
                                <Link to="/user/signup"> Sign up here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default UserLogin;
