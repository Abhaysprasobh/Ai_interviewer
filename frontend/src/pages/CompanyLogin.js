import { Link } from "react-router-dom";

const CompanyLogin = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            AI Hiring
          </Link>

          <ul className="navbar-nav">
            <li>
              <Link to="/user-login" className="navbar-link">
                Job Seeker Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Login Form */}
      <section className="py-5">
        <div className="container-small">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Company Login</h2>
            </div>

            <div className="card-body">
              {/* Error message container */}
              <div
                id="errorMessage"
                className="alert alert-error hidden"
              ></div>

              <form id="loginForm">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Company Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="company@example.com"
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
                    name="password"
                    className="form-input"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-large"
                >
                  Login
                </button>
              </form>

              <div className="divider"></div>

              <p className="text-center text-muted">
                Don&apos;t have an account?{" "}
                <Link to="/company-signup">Sign up here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            &copy; 2024 AI Hiring Platform. All rights reserved.
          </p>

          <ul className="footer-links">
            <li>
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default CompanyLogin;
