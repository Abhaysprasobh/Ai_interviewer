// app/user/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Calendar, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import GlobalApi from "@/app/_utils/GlobalApi";
import { isAuthenticated, isUser } from "@/app/_utils/auth";
import StatusBadge from "@/app/_components/StatusBadge";


export default function UserDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated() || !isUser()) {
      router.push("/user/login");
      return;
    }

    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const resp = await GlobalApi.getMyApplications();
      setApplications(resp.data || []);
    } catch (err) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-600">Track your job applications and interview progress</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Applications"
          value={applications.length}
          icon={<FileText className="w-5 h-5" />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Under Review"
          value={applications.filter((a) => a.status === "reviewed").length}
          icon={<TrendingUp className="w-5 h-5" />}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          label="Shortlisted"
          value={applications.filter((a) => a.status === "shortlisted").length}
          icon={<Calendar className="w-5 h-5" />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          label="Interviews"
          value={
            applications.filter((a) =>
              ["interview_scheduled", "interview_completed"].includes(a.status)
            ).length
          }
          icon={<Calendar className="w-5 h-5" />}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications Yet</h3>
          <p className="text-slate-600 mb-6">Start browsing jobs and apply to your dream role!</p>
          <Link
            href="/user/jobs"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard key={application._id} application={application} formatDate={formatDate} />
          ))}
        </div>
      )}
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

function ApplicationCard({ application, formatDate }) {
    const job = application.job || application.jobId;
    const companyName = job?.companyName || job?.companyId?.companyName || "Company Name";
    const title = job?.title || job?.name || "Job Title";
    const jobId = job?._id || job?.id || application.jobId?._id;

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-slate-900">
                {title}
              </h3>
              <StatusBadge status={application.status} />
            </div>
            <p className="text-slate-600 mb-3">
              {companyName}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Applied: {formatDate(application.appliedAt)}</span>
              </div>
              {application.aiResumeScore !== null && application.aiResumeScore !== undefined && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Resume Score: {application.aiResumeScore}/100</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {application.status === "interview_scheduled" && (
              <Link
                href={`/user/interview/${application._id}`}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Join Interview
              </Link>
            )}
            <Link
              href={`/user/jobs/${jobId}`}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
            >
              View Job
            </Link>
          </div>
        </div>
      </div>
    );
  }
