"use client";

import { useMemo, useState, Fragment } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  FileText,
  Search,
  CheckSquare,
  CheckCircle2,
  XCircle,
  BarChart,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import StatusBadge from "@/app/_components/StatusBadge";
import GlobalApi from "@/app/_utils/GlobalApi";

const STATUS_OPTIONS = [
  // "submitted",
  // "reviewed",
  "interview_scheduled",
  "interview_completed",
  "rejected",
  "shortlisted",
];

export default function ApplicantsTable({ applicants = [], jobId, refresh }) {
  const [search, setSearch] = useState("");
  const [expandedAppId, setExpandedAppId] = useState(null);
  
  const toggleExpand = (appId) => {
      setExpandedAppId(expandedAppId === appId ? null : appId);
  };
  
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState("appliedAt");
  const [selected, setSelected] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [feedback, setFeedback] = useState(null);


  const [minResumeScore, setMinResumeScore] = useState("");
  const [minInterviewScore, setMinInterviewScore] = useState("");
  const [minCombinedScore, setMinCombinedScore] = useState("");

  // Show feedback message
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const viewResume = async (resumeUrl) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/applications/files/view/${encodeURIComponent(resumeUrl)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      alert("Failed to load resume");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const filteredApplicants = useMemo(() => {
    const resumeMin = minResumeScore === "" ? null : Number(minResumeScore);
    const interviewMin =
      minInterviewScore === "" ? null : Number(minInterviewScore);
    const combinedMin = minCombinedScore === "" ? null : Number(minCombinedScore);

    return applicants
      .filter((a) => {
        if (statusFilter && a.status !== statusFilter) return false;

        const resume = a.aiResumeScore ?? 0;
        const interview = a.aiInterviewScore ?? 0;
        const combined = interview ? interview * 0.6 + resume * 0.4 : resume;

        if (resumeMin !== null && resume < resumeMin) return false;
        if (interviewMin !== null && interview < interviewMin) return false;
        if (combinedMin !== null && combined < combinedMin) return false;

        if (!search) return true;

        const q = search.toLowerCase();
        return (
          a.user?.fullName?.toLowerCase().includes(q) ||
          a.user?.email?.toLowerCase().includes(q) ||
          a.user?.mobile?.includes(q)
        );
      })
      .sort((a, b) => {
        if (sortKey === "aiResumeScore") {
          return (b.aiResumeScore ?? 0) - (a.aiResumeScore ?? 0);
        }
        if (sortKey === "aiInterviewScore") {
          return (b.aiInterviewScore ?? 0) - (a.aiInterviewScore ?? 0);
        }
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      });
  }, [
    applicants,
    search,
    statusFilter,
    sortKey,
    minResumeScore,
    minInterviewScore,
    minCombinedScore,
  ]);
  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const selectAll = () => setSelected(filteredApplicants.map((a) => a._id));

  const clearSelection = () => setSelected([]);

  const bulkUpdateStatus = async (status) => {
    if (!status) return;
    setBulkLoading(true);
    try {
      await GlobalApi.bulkUpdateApplicationStatus(jobId, selected, status);
      showFeedback(
        "success",
        `Successfully updated ${selected.length} application(s)`,
      );
      clearSelection();
      setPendingStatus("");
      refresh?.();
    } catch (e) {
      console.error(e);
      showFeedback("error", "Failed to update applications. Please try again.");
    } finally {
      setBulkLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-white border border-slate-300 rounded-2xl shadow-md">
      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 animate-in slide-in-from-top-5 ${
            feedback.type === "success"
              ? "bg-green-50 border-green-500 text-green-900"
              : "bg-red-50 border-red-500 text-red-900"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* ===== TOOLBAR ===== */}
      <div className="p-4 bg-slate-100 border-b border-slate-300 rounded-t-2xl">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone"
              className="w-full pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm text-slate-900 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Resume"
            value={minResumeScore}
            onChange={(e) => setMinResumeScore(e.target.value)}
            className="w-28 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:outline-none"
          />

          <input
            type="number"
            placeholder="Min Interview"
            value={minInterviewScore}
            onChange={(e) => setMinInterviewScore(e.target.value)}
            className="w-32 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:outline-none"
          />

          <input
            type="number"
            placeholder="Min Combined"
            value={minCombinedScore}
            onChange={(e) => setMinCombinedScore(e.target.value)}
            className="w-32 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:outline-none"
          />

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="px-3 py-2 text-sm text-slate-900 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="appliedAt">Newest first</option>
            <option value="aiResumeScore">Resume score</option>
            <option value="aiInterviewScore">Interview score</option>
          </select>

          {/* BULK BAR */}
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 ml-auto bg-indigo-50 border-2 border-indigo-400 px-4 py-2 rounded-xl shadow-md">
              <span className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                {selected.length} selected
              </span>

              <select
                value={pendingStatus}
                onChange={(e) => setPendingStatus(e.target.value)}
                className="px-3 py-1.5 text-sm text-slate-900 bg-white border-2 border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer"
              >
                <option value="">Select status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>

              <button
                disabled={!pendingStatus || bulkLoading}
                onClick={() => bulkUpdateStatus(pendingStatus)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  pendingStatus && !bulkLoading
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                    : "bg-slate-300 text-slate-600 cursor-not-allowed"
                }`}
              >
                {bulkLoading ? "Updating…" : "Apply"}
              </button>

              <button
                onClick={clearSelection}
                className="text-sm text-indigo-700 hover:text-indigo-900 font-medium underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-200 border-b border-slate-400">
            <tr className="text-slate-900 font-semibold">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  onChange={selectAll}
                  checked={
                    selected.length > 0 &&
                    selected.length === filteredApplicants.length
                  }
                  className="w-4 h-4 cursor-pointer accent-indigo-600"
                />
              </th>
              <th className="px-4 py-3 text-left border-r border-slate-300">
                Candidate
              </th>
              <th className="px-4 py-3 text-center border-r border-slate-300">
                Status
              </th>
              <th className="px-4 py-3 text-center border-l border-slate-300">
                Resume
              </th>
              <th className="px-4 py-3 text-center">Interview</th>
              <th className="px-4 py-3 text-center border-r border-slate-300">
                Combined
              </th>
              <th className="px-4 py-3 text-center border-r border-slate-300">
                Applied
              </th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplicants.map((app, idx) => {
              const isSelected = selected.includes(app._id);
              const isExpanded = expandedAppId === app._id;

              return (
                <Fragment key={app._id}>
                  {/* MAIN ROW */}
                  <tr
                    className={`
                      border-b border-slate-200
                      ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      ${isSelected ? "!bg-indigo-100 border-indigo-300" : ""}
                      ${isExpanded ? "!bg-indigo-50 border-b-0" : ""}
                      hover:bg-indigo-50 transition-colors
                    `}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(app._id)}
                        className="w-4 h-4 cursor-pointer accent-indigo-600"
                      />
                    </td>

                    {/* Candidate */}
                    <td className="px-4 py-3 border-r border-slate-300">
                      <div className="font-semibold text-slate-900">
                        {app.user?.fullName}
                      </div>
                      <div className="mt-1 text-xs text-slate-700 space-y-1">
                        {app.user?.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-600" />
                            <span>{app.user.email}</span>
                          </div>
                        )}
                        {app.user?.mobile && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-600" />
                            <span>{app.user.mobile}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Scores (UPDATED WITH EXPAND ICON) */}
                    {/* Resume Score */}
                    <td className="px-4 py-3 text-center border-l border-slate-200">
                      <span className="font-semibold text-slate-800">
                        {app.aiResumeScore !== null &&
                        app.aiResumeScore !== undefined
                          ? `${app.aiResumeScore}%`
                          : "—"}
                      </span>
                    </td>
                    {/* Interview Score */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-indigo-700">
                          {app.aiInterviewScore !== null &&
                          app.aiInterviewScore !== undefined
                            ? `${app.aiInterviewScore}%`
                            : "—"}
                        </span>

                        {app.aiInterviewScore !== null &&
                          app.aiInterviewScore !== undefined && (
                            <button
                              onClick={() => toggleExpand(app._id)}
                              className="p-1 hover:bg-indigo-200 rounded text-indigo-600 transition-colors"
                              title="View Interview Dashboard"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <BarChart className="w-4 h-4" />
                              )}
                            </button>
                          )}
                      </div>
                    </td>
                    {/* Combined Score */}
                    <td className="px-4 py-3 text-center border-r border-slate-200">
                      {(() => {
                        const resume = app.aiResumeScore ?? 0;
                        const interview = app.aiInterviewScore ?? 0;
                        const combined = interview
                          ? Math.round(interview * 0.6 + resume * 0.4)
                          : resume;

                        return (
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold text-green-700">
                              {combined ? `${combined}%` : "—"}
                            </span>

                            {/* keep proctoring flag */}
                            {app.proctoring_flag && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Flagged
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    {/* Applied */}
                    <td className="px-4 py-3 text-slate-700 text-center border-r border-slate-300">
                      {formatDate(app.appliedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {app.resumeUrl && (
                          <button
                            onClick={() => viewResume(app.resumeUrl)}
                            className="p-2 border border-slate-400 rounded-lg hover:bg-slate-200 transition-colors text-slate-700 hover:text-slate-900"
                            title="View Resume"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          href={`/company/applicants/${app._id}`}
                          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-sm hover:shadow-md"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED DASHBOARD ROW */}
                  {isExpanded && app.interviewDetails && (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-0 border-b border-slate-200 bg-slate-50"
                      >
                        <div className="p-6 border-t border-indigo-100 shadow-inner">
                          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            {/* Proctoring Alert */}
                            {app.proctoring_flag && (
                              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                  <h4 className="font-bold text-red-800">
                                    Proctoring Violation Logged
                                  </h4>
                                  <p className="text-red-700 text-sm mt-1">
                                    {app.proctoring_reason}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* AI Summary */}
                            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                              <BarChart className="w-4 h-4 text-indigo-500" />
                              AI Interview Summary
                            </h4>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                              {app.interviewSummary}
                            </p>

                            {/* Detailed Q&A Transcript */}
                            <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">
                              Detailed Q&A Transcript
                            </h4>
                            <div className="space-y-4">
                              {app.interviewDetails.map((detail, index) => (
                                <div
                                  key={index}
                                  className="bg-slate-50 border border-slate-100 p-4 rounded-lg"
                                >
                                  <p className="font-bold text-slate-800 text-sm mb-2">
                                    <span className="text-indigo-600 mr-2">
                                      Q{index + 1}:
                                    </span>
                                    {detail.question}
                                  </p>

                                  <div className="text-sm text-slate-600 mb-3 pl-4 border-l-2 border-indigo-200 whitespace-pre-wrap">
                                    {detail.answer || (
                                      <span className="italic text-slate-400">
                                        No audio transcribed.
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex gap-6 mt-2 border-t border-slate-200 pt-3">
                                    <span className="text-xs font-semibold text-slate-500">
                                      Tech Score:{" "}
                                      <span className="text-indigo-600 ml-1">
                                        {detail.final_technical_score}/10
                                      </span>
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">
                                      Comm Score:{" "}
                                      <span className="text-indigo-600 ml-1">
                                        {detail.communication_score}/10
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}

            {filteredApplicants.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-16 text-center text-slate-600"
                >
                  {search ||
                  statusFilter ||
                  minResumeScore ||
                  minInterviewScore ||
                  minCombinedScore
                    ? "No applicants match your current filters"
                    : "No applicants yet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}