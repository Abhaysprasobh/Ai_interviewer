import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const CompanyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

      const res = await fetch(`${backendUrl}/api/auth/company/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      history.push("/company/dashboard");
    } catch (err) {
      setError(err.message);
      console.log("Error:", err);
    }
  };

  return (
    <div className="company-login">
      <section className="py-5">
        <div className="container-small">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Company Login</h2>
            </div>

            <div className="card-body">
              {error && <p className="error">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Company Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="company@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
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
                Don&apos;t have an account?{" "}
                <Link to="/company/signup">Sign up here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyLogin;
