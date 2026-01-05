import { Link, useHistory } from "react-router-dom";

const CompanyDashboard = () => {
  const routerHistory = useHistory();

  return (
    <section className="dashboard">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Job Postings</h1>
            <p className="text-muted">
              Manage your job listings and view applicants
            </p>
          </div>

          <Link to="/create-job" className="btn btn-primary btn-large">
            + Create Job
          </Link>
        </div>

        {/* Loading State */}
        <div id="loadingState" className="loading hidden">
          <div className="spinner"></div>
        </div>

        {/* Jobs List */}
        <div id="jobsList" className="dashboard-section">
          {/* Job Card 1 */}
          <div
            className="card card-clickable"
            onClick={() => routerHistory.push("/view-job")}
          >
            <div className="card-header">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="card-title">Senior Software Engineer</h3>
                  <p className="text-muted text-small">Posted 2 days ago</p>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
            </div>

            <div className="card-body">
              <div className="flex gap-4 mb-3">
                <div>
                  <p className="text-small text-muted">Total Applications</p>
                  <p className="text-large text-bold">24</p>
                </div>
                <div>
                  <p className="text-small text-muted">Under Review</p>
                  <p className="text-large text-bold">18</p>
                </div>
                <div>
                  <p className="text-small text-muted">Shortlisted</p>
                  <p className="text-large text-bold">6</p>
                </div>
              </div>
              <p className="text-small text-muted">
                Mountain View, CA • Full-time • Python, Go, Kubernetes
              </p>
            </div>

            <div className="card-footer">
              <Link
                to="/view-job"
                className="btn btn-primary btn-small"
                onClick={(e) => e.stopPropagation()}
              >
                View Applicants
              </Link>
              <Link
                to="/create-job"
                className="btn btn-outline btn-small"
                onClick={(e) => e.stopPropagation()}
              >
                Edit Job
              </Link>
            </div>
          </div>

          {/* Job Card 2 */}
          <div
            className="card card-clickable"
            onClick={() => routerHistory.push("/view-job")}
          >
            <div className="card-header">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="card-title">Product Manager</h3>
                  <p className="text-muted text-small">Posted 5 days ago</p>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
            </div>

            <div className="card-body">
              <div className="flex gap-4 mb-3">
                <div>
                  <p className="text-small text-muted">Total Applications</p>
                  <p className="text-large text-bold">42</p>
                </div>
                <div>
                  <p className="text-small text-muted">Under Review</p>
                  <p className="text-large text-bold">35</p>
                </div>
                <div>
                  <p className="text-small text-muted">Shortlisted</p>
                  <p className="text-large text-bold">7</p>
                </div>
              </div>
              <p className="text-small text-muted">
                Remote • Full-time • Product Strategy, Agile, Cloud
              </p>
            </div>

            <div className="card-footer">
              <Link
                to="/view-job"
                className="btn btn-primary btn-small"
                onClick={(e) => e.stopPropagation()}
              >
                View Applicants
              </Link>
              <Link
                to="/create-job"
                className="btn btn-outline btn-small"
                onClick={(e) => e.stopPropagation()}
              >
                Edit Job
              </Link>
            </div>
          </div>

          {/* Job Card 3 */}
          <div
            className="card card-clickable"
            onClick={() => routerHistory.push("/view-job")}
          >
            <div className="card-header">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="card-title">Data Scientist</h3>
                  <p className="text-muted text-small">Posted 3 weeks ago</p>
                </div>
                <span className="badge badge-secondary">Closed</span>
              </div>
            </div>

            <div className="card-body">
              <div className="flex gap-4 mb-3">
                <div>
                  <p className="text-small text-muted">Total Applications</p>
                  <p className="text-large text-bold">67</p>
                </div>
                <div>
                  <p className="text-small text-muted">Under Review</p>
                  <p className="text-large text-bold">0</p>
                </div>
                <div>
                  <p className="text-small text-muted">Shortlisted</p>
                  <p className="text-large text-bold">12</p>
                </div>
              </div>
              <p className="text-small text-muted">
                New York, NY • Full-time • Python, ML, SQL
              </p>
            </div>

            <div className="card-footer">
              <Link
                to="/view-job"
                className="btn btn-outline btn-small"
                onClick={(e) => e.stopPropagation()}
              >
                View Applicants
              </Link>
            </div>
          </div>

          {/* Job Card 4 */}
          <div
            className="card card-clickable"
            onClick={() => routerHistory.push("/create-job")}
          >
            <div className="card-header">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="card-title">Frontend Developer</h3>
                  <p className="text-muted text-small">
                    Draft saved 1 day ago
                  </p>
                </div>
                <span className="badge badge-warning">Draft</span>
              </div>
            </div>

            <div className="card-body">
              <p className="text-small text-muted">
                This job posting is not yet published. Complete and publish to
                start receiving applications.
              </p>
            </div>

            <div className="card-footer">
              <Link
                to="/create-job"
                className="btn btn-primary btn-small"
                onClick={(e) => e.stopPropagation()}
              >
                Complete &amp; Publish
              </Link>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div id="emptyState" className="empty-state hidden">
          <div className="empty-state-icon">💼</div>
          <h3 className="empty-state-title">No Jobs Posted Yet</h3>
          <p className="empty-state-text">
            Create your first job posting to start receiving applications from
            qualified candidates.
          </p>
          <Link to="/create-job" className="btn btn-primary btn-large">
            Create Your First Job
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompanyDashboard;

