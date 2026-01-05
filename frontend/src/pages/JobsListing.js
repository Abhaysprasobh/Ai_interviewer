import { useHistory } from "react-router-dom";

const JobsListing = () => {
  const routerHistory = useHistory();

  return (
    <section className="dashboard">
      <div className="container">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Browse Jobs</h1>
            <p className="text-muted">Find your next opportunity</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              id="searchInput"
              className="form-input"
              placeholder="Search by job title or company..."
              style={{ maxWidth: "400px" }}
            />
            <button className="btn btn-primary">Search</button>
          </div>
        </div>

        {/* Loading State */}
        <div id="loadingState" className="loading hidden">
          <div className="spinner"></div>
        </div>

        {/* Jobs List */}
        <div id="jobsList">
          {/* Job Card */}
          {[
            {
              title: "Senior Software Engineer",
              company: "Google",
              location: "Mountain View, CA",
              posted: "2 days ago",
              desc:
                "We're looking for an experienced software engineer to join our core infrastructure team.",
              skills: ["Python", "Go", "Kubernetes"],
            },
            {
              title: "Product Manager",
              company: "Microsoft",
              location: "Seattle, WA",
              posted: "3 days ago",
              desc:
                "Lead product strategy and execution for our cloud services platform.",
              skills: ["Product Strategy", "Agile", "Cloud"],
            },
            {
              title: "Data Scientist",
              company: "Amazon",
              location: "New York, NY",
              posted: "5 days ago",
              desc:
                "Build machine learning models that power personalization and recommendations.",
              skills: ["Python", "ML", "SQL"],
            },
            {
              title: "Frontend Developer",
              company: "Meta",
              location: "Menlo Park, CA",
              posted: "1 week ago",
              desc:
                "Build and maintain user interfaces using React and modern JavaScript.",
              skills: ["React", "JavaScript", "CSS"],
            },
            {
              title: "UX Designer",
              company: "Apple",
              location: "Cupertino, CA",
              posted: "1 week ago",
              desc:
                "Design beautiful and intuitive user experiences for next-gen products.",
              skills: ["Figma", "UI/UX", "Design Systems"],
            },
            {
              title: "Backend Engineer",
              company: "Netflix",
              location: "Los Gatos, CA",
              posted: "2 weeks ago",
              desc:
                "Build backend services that power streaming for millions worldwide.",
              skills: ["Java", "AWS", "Microservices"],
            },
          ].map((job, index) => (
            <div
              key={index}
              className="job-card"
              onClick={() => routerHistory.push("/job-detail")}
            >
              <h3 className="job-card-title">{job.title}</h3>
              <p className="job-card-company">{job.company}</p>

              <div className="job-card-meta">
                <span>📍 {job.location}</span>
                <span>📅 Posted {job.posted}</span>
              </div>

              <p className="job-card-description">{job.desc}</p>

              <div className="job-card-footer">
                <div className="job-card-skills">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="badge badge-primary">
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  className="btn btn-primary btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    routerHistory.push("/job-apply");
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div id="emptyState" className="empty-state hidden">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No Jobs Found</h3>
          <p className="empty-state-text">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JobsListing;
