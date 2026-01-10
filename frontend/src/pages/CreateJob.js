import { Link, useHistory } from "react-router-dom";

const CreateJob = () => {
  const routerHistory = useHistory();

  const handleSaveDraft = () => {
    // TODO: save draft logic
    routerHistory.push("/dashboard");
  };

  return (
    <div id="create-job">
      <section className="dashboard">
        <div className="container-narrow">
          {/* Back Button */}
          <div className="mb-3">
            <Link to="/dashboard" className="btn btn-secondary btn-small">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-4">
            <h1 className="dashboard-title">Create Job Posting</h1>
            <p className="text-muted">
              Fill in the job details to start receiving applications
            </p>
          </div>

          {/* Alert Messages */}
          <div id="successMessage" className="alert alert-success hidden"></div>
          <div id="errorMessage" className="alert alert-error hidden"></div>

          {/* Job Form */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Job Details</h2>
            </div>

            <div className="card-body">
              <form id="jobForm">
                {/* Job Title */}
                <div className="form-group">
                  <label htmlFor="jobTitle" className="form-label">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    className="form-input"
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>

                {/* Job Type */}
                <div className="form-group">
                  <label htmlFor="jobType" className="form-label">
                    Job Type *
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    className="form-select"
                    required
                  >
                    <option value="">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                {/* Location */}
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Job Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-textarea"
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    rows="6"
                    required
                  ></textarea>
                  <span className="form-help">
                    Be detailed – this helps attract the right candidates
                  </span>
                </div>

                {/* Skills */}
                <div className="form-group">
                  <label htmlFor="skills" className="form-label">
                    Required Skills *
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    className="form-input"
                    placeholder="e.g., Python, React, AWS (comma-separated)"
                    required
                  />
                  <span className="form-help">
                    Separate skills with commas
                  </span>
                </div>

                {/* Experience */}
                <div className="form-group">
                  <label htmlFor="experience" className="form-label">
                    Experience Level
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    className="form-select"
                  >
                    <option value="">Select experience level</option>
                    <option value="entry">Entry Level (0–2 years)</option>
                    <option value="mid">Mid Level (2–5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                    <option value="lead">Lead / Principal (8+ years)</option>
                  </select>
                </div>

                {/* Salary */}
                <div className="form-group">
                  <label className="form-label">
                    Salary Range (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="salaryMin"
                      className="form-input"
                      placeholder="Min (e.g., 80000)"
                      min="0"
                    />
                    <input
                      type="number"
                      name="salaryMax"
                      className="form-input"
                      placeholder="Max (e.g., 120000)"
                      min="0"
                    />
                  </div>
                  <span className="form-help">
                    Annual salary in USD
                  </span>
                </div>

                {/* Responsibilities */}
                <div className="form-group">
                  <label htmlFor="responsibilities" className="form-label">
                    Key Responsibilities (Optional)
                  </label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    className="form-textarea"
                    rows="5"
                  ></textarea>
                </div>

                {/* Qualifications */}
                <div className="form-group">
                  <label htmlFor="qualifications" className="form-label">
                    Required Qualifications (Optional)
                  </label>
                  <textarea
                    id="qualifications"
                    name="qualifications"
                    className="form-textarea"
                    rows="4"
                  ></textarea>
                </div>

                <div className="divider"></div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                  >
                    Publish Job
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-large"
                    onClick={handleSaveDraft}
                  >
                    Save as Draft
                  </button>

                  <Link
                    to="/dashboard"
                    className="btn btn-outline btn-large"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Info Card */}
          <div className="card" style={{ background: "#f9f9f9" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
              After Publishing
            </h3>
            <ul style={{ paddingLeft: "1.5rem", margin: 0, color: "#555" }}>
              <li style={{ marginBottom: "0.5rem" }}>
                Candidates can apply with resumes
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                AI will automatically screen applications
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Review AI-scored applicants and interviews
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Shortlist and make hiring decisions
              </li>
            </ul>
          </div>
        </div>
      </section>
   </div>
  );
};

export default CreateJob;
