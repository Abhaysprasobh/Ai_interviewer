import { Link } from "react-router-dom";

const JobDetail = () => {
  return (
    <section className="dashboard">
      <div className="container-narrow">
        {/* Back Button */}
        <div className="mb-3">
          <Link to="/jobs" className="btn btn-secondary btn-small">
            ← Back to Jobs
          </Link>
        </div>

        {/* Job Header Card */}
        <div className="card">
          <div className="card-header">
            <h1
              className="card-title"
              style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}
            >
              Senior Software Engineer
            </h1>
            <p className="text-large text-muted">Google</p>
          </div>

          <div className="card-body">
            {/* Job Meta */}
            <div className="flex gap-3 mb-4">
              <div>
                <p className="text-small text-muted">Location</p>
                <p className="text-bold">Mountain View, CA</p>
              </div>
              <div>
                <p className="text-small text-muted">Posted</p>
                <p className="text-bold">2 days ago</p>
              </div>
              <div>
                <p className="text-small text-muted">Type</p>
                <p className="text-bold">Full-time</p>
              </div>
            </div>

            {/* Apply Button */}
            <Link
              to="/job-apply"
              className="btn btn-primary btn-large btn-block"
            >
              Apply for this Position
            </Link>
          </div>
        </div>

        {/* About Role */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">About the Role</h2>
          </div>
          <div className="card-body">
            <p>
              We're looking for an experienced software engineer to join our core
              infrastructure team. In this role, you'll build and maintain
              scalable systems that serve billions of users worldwide.
            </p>
            <p>
              You'll collaborate with top engineers, tackle complex technical
              challenges, and push the boundaries of distributed systems and
              cloud infrastructure.
            </p>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Key Responsibilities</h2>
          </div>
          <div className="card-body">
            <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
              <li style={{ marginBottom: "0.75rem" }}>
                Design and implement scalable backend services
              </li>
              <li style={{ marginBottom: "0.75rem" }}>
                Collaborate with cross-functional teams
              </li>
              <li style={{ marginBottom: "0.75rem" }}>
                Optimize system performance and reliability
              </li>
              <li style={{ marginBottom: "0.75rem" }}>
                Mentor junior engineers and review code
              </li>
              <li style={{ marginBottom: "0.75rem" }}>
                Contribute to architectural decisions
              </li>
            </ul>
          </div>
        </div>

        {/* Requirements */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Required Skills & Qualifications</h2>
          </div>
          <div className="card-body">
            <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
              Required:
            </h3>
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="badge badge-primary">Python</span>
              <span className="badge badge-primary">Go</span>
              <span className="badge badge-primary">Kubernetes</span>
              <span className="badge badge-primary">Docker</span>
              <span className="badge badge-primary">
                Distributed Systems
              </span>
            </div>

            <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
              Qualifications:
            </h3>
            <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}>
                5+ years of software engineering experience
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Strong data structures & algorithms
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Experience with cloud platforms (AWS/GCP/Azure)
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Bachelor&apos;s degree in Computer Science or related field
              </li>
            </ul>
          </div>
        </div>

        {/* Benefits */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Benefits</h2>
          </div>
          <div className="card-body">
            <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}>
                Competitive salary and equity
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Comprehensive health insurance
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Flexible work arrangements
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Professional development budget
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Generous PTO and parental leave
              </li>
            </ul>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="card" style={{ background: "#f9f9f9" }}>
          <div className="text-center">
            <h3 style={{ marginBottom: "1rem" }}>Ready to Apply?</h3>
            <p className="text-muted mb-3">
              Submit your application and our AI will review your resume and
              conduct an initial interview.
            </p>
            <Link to="/job-apply" className="btn btn-primary btn-large">
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetail;
