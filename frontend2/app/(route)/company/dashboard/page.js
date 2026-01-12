// app/company/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalApi from "@/app/_utils/GlobalApi";
import { isAuthenticated, isCompany } from "@/app/_utils/auth";
import { Briefcase, Users, TrendingUp, Clock, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CompanyDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated() || !isCompany()) {
            router.push("/company/login");
            return;
        }

        fetchCompanyJobs();
    }, []);

    const fetchCompanyJobs = async () => {
        try {
            const resp = await GlobalApi.getCompanyJobs();
            setJobs(resp.data || []);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
    const activeJobs = jobs.filter((job) => job.status === "active").length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-whiteg">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Company Dashboard</h1>
                    <p className="text-slate-600">Manage your job postings and applicants</p>
                </div>
                <Link
                    href="/company/jobs/create"
                    className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Post New Job
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard
                    label="Total Jobs"
                    value={jobs.length}
                    icon={<Briefcase className="w-5 h-5" />}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard
                    label="Active Jobs"
                    value={activeJobs}
                    icon={<Clock className="w-5 h-5" />}
                    color="bg-green-100 text-green-600"
                />
                <StatCard
                    label="Total Applications"
                    value={totalApplications}
                    icon={<Users className="w-5 h-5" />}
                    color="bg-purple-100 text-purple-600"
                />
                <StatCard
                    label="Avg. per Job"
                    value={jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="bg-indigo-100 text-indigo-600"
                />
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-2xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">Your Job Postings</h2>
                </div>

                {jobs.length === 0 ? (
                    <div className="p-12 text-center">
                        <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Posted Yet</h3>
                        <p className="text-slate-600 mb-6">Start by creating your first job posting</p>
                        <Link
                            href="/company/jobs/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Create Job Posting
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {jobs.map((job) => (
                            <JobRow key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
            <div className="text-sm text-slate-600">{label}</div>
        </div>
    );
}

function JobRow({ job }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Link
            href={`/company/jobs/${job._id}`}
            className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
        >
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                    >
                        {job.status === "active" ? "Active" : "Closed"}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{job.location || "Remote"}</span>
                    <span>•</span>
                    <span>Posted {formatDate(job.createdAt)}</span>
                    <span>•</span>
                    <span>{job.applicationCount || 0} applications</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm">
                    View Details →
                </span>
            </div>
        </Link>
    );
}