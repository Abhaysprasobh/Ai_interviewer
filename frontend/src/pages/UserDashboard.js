import { useState } from "react";
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    return (
        <>
            {/* Dashboard */}
            <section className="dashboard">
                <div className="container">
                    {/* Dashboard Header */}
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">My Applications</h1>
                            <p className="text-muted">Track your job applications and interview status</p>
                        </div>
                        <Link to="/jobs-listing" className="btn btn-primary">Browse Jobs</Link>
                    </div>

                    {/* Applications Section */}
                    <div className="dashboard-section">
                        <h2 className="dashboard-section-title">Recent Applications</h2>

                        {/* Loading State (hidden by default) */}
                        <div id="loadingState" className="loading hidden">
                            <div className="spinner"></div>
                        </div>

                        {/* Applications List */}
                        <div id="applicationsList">
                            {/* Application Card 1 - Submitted */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="card-title">Senior Software Engineer</h3>
                                        <p className="text-muted text-small">Google • Applied 2 days ago</p>
                                    </div>
                                    <span className="status-badge status-submitted">Submitted</span>
                                </div>
                                <p className="text-small text-muted mb-3">Your application has been received and is under review.</p>
                                <div className="card-footer">
                                    <Link to="/job-detail" className="btn btn-small btn-outline">View Job</Link>
                                </div>
                            </div>

                            {/* Application Card 2 - Resume Reviewed */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="card-title">Product Manager</h3>
                                        <p className="text-muted text-small">Microsoft • Applied 5 days ago</p>
                                    </div>
                                    <span className="status-badge status-reviewed">Resume Reviewed</span>
                                </div>
                                <p className="text-small text-muted mb-3">Your resume has been reviewed by our AI. Interview invitation pending.</p>
                                <div className="card-footer">
                                    <Link to="/job-detail" className="btn btn-small btn-outline">View Job</Link>
                                </div>
                            </div>

                            {/* Application Card 3 - Interview Pending */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="card-title">Data Scientist</h3>
                                        <p className="text-muted text-small">Amazon • Applied 1 week ago</p>
                                    </div>
                                    <span className="status-badge status-pending">Interview Pending</span>
                                </div>
                                <p className="text-small text-muted mb-3">You've been invited to complete an AI interview. Please complete it within 3 days.</p>
                                <div className="card-footer">
                                    <Link to="/interview-join" className="btn btn-small btn-primary">Start Interview</Link>
                                    <Link to="/job-detail" className="btn btn-small btn-outline">View Job</Link>
                                </div>
                            </div>

                            {/* Application Card 4 - Interview Completed */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="card-title">Frontend Developer</h3>
                                        <p className="text-muted text-small">Meta • Applied 2 weeks ago</p>
                                    </div>
                                    <span className="status-badge status-completed">Interview Completed</span>
                                </div>
                                <p className="text-small text-muted mb-3">Your interview has been completed. The company is reviewing your responses.</p>
                                <div className="card-footer">
                                    <Link to="/job-detail" className="btn btn-small btn-outline">View Job</Link>
                                </div>
                            </div>

                            {/* Application Card 5 - Shortlisted */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="card-title">UX Designer</h3>
                                        <p className="text-muted text-small">Apple • Applied 3 weeks ago</p>
                                    </div>
                                    <span className="status-badge status-shortlisted">Shortlisted</span>
                                </div>
                                <p className="text-small text-muted mb-3">Congratulations! You've been shortlisted. The company will contact you soon.</p>
                                <div className="card-footer">
                                    <Link to="/job-detail" className="btn btn-small btn-outline">View Job</Link>
                                </div>
                            </div>

                            {/* Application Card 6 - Rejected */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="card-title">Backend Engineer</h3>
                                        <p className="text-muted text-small">Netflix • Applied 1 month ago</p>
                                    </div>
                                    <span className="status-badge status-rejected">Not Selected</span>
                                </div>
                                <p className="text-small text-muted mb-3">Unfortunately, you weren't selected for this position. Keep applying!</p>
                                <div className="card-footer">
                                    <Link to="/job-detail" className="btn btn-small btn-outline">View Job</Link>
                                </div>
                            </div>
                        </div>

                        {/* Empty State (hidden by default) */}
                        <div id="emptyState" className="empty-state hidden">
                            <div className="empty-state-icon">📋</div>
                            <h3 className="empty-state-title">No Applications Yet</h3>
                            <p className="empty-state-text">You haven't applied to any jobs yet. Start browsing available positions!</p>
                            <Link to="/jobs-listing" className="btn btn-primary">Browse Jobs</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default UserDashboard;