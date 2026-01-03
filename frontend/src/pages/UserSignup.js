import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const UserSignup = () => {
    const history = useHistory();
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
            const res = await fetch(`${backendUrl}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    mobile: formData.mobile,
                    password: formData.password
                })
            });

            if (!res.ok) {
                setError("Signup failed");
                return;
            }

            history.push("/user/login");
        } catch (err) {
            setError("An error occurred");
        }
    };

    return ( 
        <div className="userSignup">
            <section className="py-5">
                <div className="container-small">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Create Job Seeker Account</h2>
                        </div>
                        <div className="card-body">
                            <div id="errorMessage" className={`alert alert-error ${error ? '' : 'hidden'}`}>{error}</div>
                            <div id="successMessage" className="alert alert-success hidden"></div>

                            <form id="signupForm" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        className="form-input"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mobile" className="form-label">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        className="form-input"
                                        placeholder="+1 234 567 8900"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="form-help">Used for interview notifications</span>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-input"
                                        placeholder="At least 8 characters"
                                        minLength="8"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-input"
                                        placeholder="Re-enter password"
                                        minLength="8"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span id="passwordError" className="form-error hidden">Passwords do not match</span>
                                </div>

                                <div className="form-group">
                                    <div className="form-checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            name="terms"
                                            className="form-checkbox"
                                            required
                                        />
                                        <label htmlFor="terms" className="form-label" style={{marginBottom: 0}}>
                                            I agree to the <Link to="/privacy" target="_blank">Terms and Privacy Policy</Link>
                                        </label>
                                    </div>
                                </div>

                                <button className="btn btn-primary btn-block btn-large">
                                    Create Account
                                </button>
                            </form>

                            <div className="divider"></div>

                            <p className="text-center text-muted">
                                Already have an account?
                                <Link to="/user/login">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
 
export default UserSignup;
