import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">AI-Powered Hiring Platform</h1>
          <p className="hero-subtitle">
            Connect talented professionals with companies through intelligent
            matching and interviews
          </p>

          {/* Main CTAs */}
          <div className="hero-cta">
            <Link to="/user-login" className="btn btn-primary btn-large">
              I'm a Job Seeker
            </Link>
            <Link to="/company-login" className="btn btn-outline btn-large">
              I'm a Company
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="grid grid-3">
            <div className="card">
              <h3>For Job Seekers</h3>
              <p className="text-muted">
                Browse open positions, apply with your resume, and complete
                AI-powered interviews at your convenience.
              </p>
            </div>

            <div className="card">
              <h3>AI Screening</h3>
              <p className="text-muted">
                Our AI evaluates resumes and conducts initial interviews,
                providing fair and consistent assessments.
              </p>
            </div>

            <div className="card">
              <h3>For Companies</h3>
              <p className="text-muted">
                Post jobs, review AI-scored candidates, and focus on the best-fit
                applicants for your roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5" style={{ background: "#f9f9f9" }}>
        <div className="container">
          <h2 className="text-center mb-4">How It Works</h2>

          <div className="grid grid-2">
            {/* Job Seeker Flow */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Job Seekers</h3>
              </div>
              <div className="card-body">
                <ol style={{ paddingLeft: "1.5rem" }}>
                  <li style={{ marginBottom: "0.75rem" }}>
                    Create an account and browse jobs
                  </li>
                  <li style={{ marginBottom: "0.75rem" }}>
                    Apply with your resume
                  </li>
                  <li style={{ marginBottom: "0.75rem" }}>
                    Complete AI interview
                  </li>
                  <li style={{ marginBottom: "0.75rem" }}>
                    Get matched with companies
                  </li>
                </ol>
              </div>
            </div>

            {/* Company Flow */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Companies</h3>
              </div>
              <div className="card-body">
                <ol style={{ paddingLeft: "1.5rem" }}>
                  <li style={{ marginBottom: "0.75rem" }}>
                    Post your job openings
                  </li>
                  <li style={{ marginBottom: "0.75rem" }}>
                    Receive AI-scored applications
                  </li>
                  <li style={{ marginBottom: "0.75rem" }}>
                    Review candidate insights
                  </li>
                  <li style={{ marginBottom: "0.75rem" }}>
                    Shortlist and hire
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
