import { Link } from "react-router-dom";

const JobApply = () => {
  return (
    <section className="dashboard">
      <div className="container-narrow">
        {/* Back Button */}
        <div className="mb-3">
          <Link to="/job-detail" className="btn btn-secondary btn-small">
            ← Back to Job
          </Link>
        </div>

        {/* Job Info Card */}
        <div className="card mb-4">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Apply for Senior Software Engineer
          </h2>
          <p className="text-muted">Google • Mountain View, CA</p>
        </div>

        {/* Application Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Application Details</h3>
          </div>

          <div className="card-body">
            {/* Success / Error Messages */}
            <div id="successMessage" className="alert alert-success hidden"></div>
            <div id="errorMessage" className="alert alert-error hidden"></div>

            <form id="applicationForm">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div className="form-group">
                <label htmlFor="whatsapp" className="form-label">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  className="form-input"
                  placeholder="+1 234 567 8900"
                />
                <span className="form-help">
                  For interview scheduling notifications
                </span>
              </div>

              {/* Resume */}
              <div className="form-group">
                <label htmlFor="resume" className="form-label">
                  Resume / CV *
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  className="form-input form-file"
                  accept=".pdf,.doc,.docx"
                  required
                />
                <span className="form-help">
                  PDF, DOC, or DOCX (Max 5MB)
                </span>
                <span
                  id="resumeError"
                  className="form-error hidden"
                >
                  Please upload a valid resume file
                </span>
              </div>

              <div className="divider"></div>

              {/* Optional Info */}
              <h3
                style={{
                  fontSize: "1.125rem",
                  marginBottom: "1rem",
                }}
              >
                Additional Information (Optional)
              </h3>

              {/* Education */}
              <div className="form-group">
                <label htmlFor="education" className="form-label">
                  Highest Education
                </label>
                <select
                  id="education"
                  name="education"
                  className="form-select"
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="associate">Associate Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>

              {/* Marks */}
              <div className="form-group">
                <label htmlFor="marks" className="form-label">
                  CGPA / Percentage
                </label>
                <input
                  type="text"
                  id="marks"
                  name="marks"
                  className="form-input"
                  placeholder="e.g., 8.5 CGPA or 85%"
                />
              </div>

              {/* Experience */}
              <div className="form-group">
                <label htmlFor="experience" className="form-label">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  className="form-input"
                  placeholder="e.g., 5"
                  min="0"
                />
              </div>

              {/* Cover Letter */}
              <div className="form-group">
                <label htmlFor="coverLetter" className="form-label">
                  Cover Letter / Message
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  className="form-textarea"
                  placeholder="Tell us why you're a great fit for this role..."
                  rows="6"
                ></textarea>
                <span className="form-help">
                  Optional but recommended
                </span>
              </div>

              <div className="divider"></div>

              {/* Consent */}
              <div className="form-group">
                <div className="form-checkbox-group">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    className="form-checkbox"
                    required
                  />
                  <label
                    htmlFor="consent"
                    className="form-label"
                    style={{ marginBottom: 0 }}
                  >
                    I consent to AI-powered resume screening and interview
                    processing
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary btn-large btn-block"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="card" style={{ background: "#f9f9f9" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            What happens next?
          </h3>
          <ol
            style={{
              paddingLeft: "1.5rem",
              margin: 0,
              color: "#555",
            }}
          >
            <li style={{ marginBottom: "0.5rem" }}>
              Your resume will be reviewed by our AI within 24 hours
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              If selected, you&apos;ll receive an invitation for an AI interview
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              Complete the interview at your convenience
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              The company will review your profile and contact you
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default JobApply;
