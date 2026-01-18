// app/_components/ApplicantCard.jsx
import Link from "next/link";
import { Mail, Phone, FileText, TrendingUp, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";

function ScoreBox({ label, value }) {
  const display = value === null || value === undefined ? "N/A" : value;
  return (
    <div className="p-3 bg-slate-50 rounded-lg flex flex-col items-start">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-lg font-semibold text-slate-900">{display}</span>
    </div>
  );
}

export default function ApplicantCard({ application }) {
  const user = application.user;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {user?.fullName || "Applicant"}
          </h3>

          <div className="flex flex-col gap-1 text-sm text-slate-600">
            {user?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            )}

            {user?.mobile && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{user.mobile}</span>
              </div>
            )}
          </div>
        </div>

        <StatusBadge status={application.status} />
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {application.aiResumeScore !== null && (
          <ScoreBox label="Resume Score" value={application.aiResumeScore} />
        )}
        {application.aiInterviewScore !== null && (
          <ScoreBox
            label="Interview Score"
            value={application.aiInterviewScore}
          />
        )}
      </div>

      {/* Applied Date */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Calendar className="w-4 h-4" />
        <span>Applied on {formatDate(application.appliedAt)}</span>
      </div>

      {/* Resume */}
      {application.resumeUrl && (
        <a
          href={`/api/files/${application.resumeUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-center"
        >
          View Resume
        </a>
      )}

      {/* Actions */}
      <Link
        href={`/company/applicants/${application._id}`}
        className="block w-full px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-center font-medium"
      >
        View Details
      </Link>
    </div>
  );
}
