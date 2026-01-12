// app/_components/ApplicantCard.jsx
import Link from "next/link";
import { Mail, Phone, FileText, TrendingUp, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ApplicantCard({ application }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {application.userId?.fullName || "Applicant"}
          </h3>
          <div className="flex flex-col gap-1 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{application.userId?.email}</span>
            </div>
            {application.userId?.mobile && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{application.userId.mobile}</span>
              </div>
            )}
          </div>
        </div>

        <StatusBadge status={application.status} />
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {application.aiResumeScore !== undefined && (
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-600">
                Resume Score
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {application.aiResumeScore}
              <span className="text-sm text-slate-500">/100</span>
            </div>
          </div>
        )}

        {application.aiInterviewScore !== undefined && (
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-600">
                Interview Score
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {application.aiInterviewScore}
              <span className="text-sm text-slate-500">/100</span>
            </div>
          </div>
        )}
      </div>

      {/* Applied Date */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Calendar className="w-4 h-4" />
        <span>Applied on {formatDate(application.appliedAt)}</span>
      </div>

      {/* Resume Link */}
      {application.resumeUrl && (
        <a
          href={application.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 text-center transition-colors"
        >
          View Resume
        </a>
      )}

      {/* Action Button */}
      <Link
        href={`/company/applicants/${application._id}`}
        className="block w-full px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-center font-medium transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
