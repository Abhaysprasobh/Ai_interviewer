"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Mail, Phone, FileText, Search, CheckSquare } from "lucide-react";
import StatusBadge from "@/app/_components/StatusBadge";
import GlobalApi from "@/app/_utils/GlobalApi";

const STATUS_OPTIONS = [
  "submitted",
  "reviewed",
  "shortlisted",
  "interview_scheduled",
  "interview_completed",
  "rejected",
];

export default function ApplicantsTable({ applicants = [], jobId, refresh }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState("appliedAt");
  const [selected, setSelected] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");


  const filteredApplicants = useMemo(() => {
    return applicants
      .filter((a) => {
        if (statusFilter && a.status !== statusFilter) return false;
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
  }, [applicants, search, statusFilter, sortKey]);

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
      clearSelection();
      refresh?.();
    } catch (e) {
      console.error(e);
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
      {/* ===== TOOLBAR ===== */}
      <div className="p-4 bg-slate-100 border-b border-slate-300 rounded-t-2xl">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone"
              className="w-full pl-9 pr-3 py-2 text-sm
                         bg-white border border-slate-400 rounded-lg
                         focus:ring-2 focus:ring-indigo-600
                         focus:border-indigo-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm
                       bg-white border border-slate-400 rounded-lg
                       focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="px-3 py-2 text-sm
                       bg-white border border-slate-400 rounded-lg
                       focus:ring-2 focus:ring-indigo-600"
          >
            <option value="appliedAt">Newest first</option>
            <option value="aiResumeScore">Resume score</option>
            <option value="aiInterviewScore">Interview score</option>
          </select>

          {/* BULK BAR */}
          {/* BULK BAR */}
          {selected.length > 0 && (
            <div
              className="flex items-center gap-3 ml-auto
                  bg-indigo-100 border border-indigo-400
                  px-4 py-2 rounded-xl shadow-sm"
            >
              <span className="text-sm font-medium text-indigo-900 flex items-center gap-1 text-black">
                <CheckSquare className="w-4 h-4" />
                {selected.length} selected
              </span>

              <select
                value={pendingStatus}
                onChange={(e) => setPendingStatus(e.target.value)}
                className="px-3 py-2 text-sm
                 bg-white text-slate-900
                 border-2 border-indigo-500 rounded-lg
                 focus:ring-2 focus:ring-indigo-600 text-black"
              >
                <option value="">Select status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>

              <button
                disabled={!pendingStatus || bulkLoading}
                onClick={() => bulkUpdateStatus(pendingStatus)}
                className={`
        px-4 py-2 rounded-lg text-sm font-semibold
        ${
          pendingStatus
            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
            : "bg-slate-300 text-slate-600 cursor-not-allowed"
        }
      `}
              >
                {bulkLoading ? "Updating…" : "Apply"}
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
                />
              </th>
              <th className="px-4 py-3 text-left">Candidate</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Scores</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplicants.map((app, idx) => {
              const isSelected = selected.includes(app._id);

              return (
                <tr
                  key={app._id}
                  className={`
                    border-b border-slate-300
                    ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    ${isSelected ? "bg-indigo-100" : ""}
                    hover:bg-indigo-50
                  `}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(app._id)}
                    />
                  </td>

                  {/* Candidate */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">
                      {app.user?.fullName}
                    </div>
                    <div className="mt-1 text-xs text-slate-700 space-y-1">
                      {app.user?.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {app.user.email}
                        </div>
                      )}
                      {app.user?.mobile && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {app.user.mobile}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>

                  {/* Scores */}
                  <td className="px-4 py-3 text-slate-800">
                    <div>
                      Resume: <b>{app.aiResumeScore ?? "—"}</b>
                    </div>
                    <div>
                      Interview: <b>{app.aiInterviewScore ?? "—"}</b>
                    </div>
                  </td>

                  {/* Applied */}
                  <td className="px-4 py-3 text-slate-700">
                    {formatDate(app.appliedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {app.resumeUrl && (
                        <a
                          href={`/api/files/${app.resumeUrl}`}
                          target="_blank"
                          className="p-2 border border-slate-400 rounded-lg
                                     hover:bg-slate-200"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        href={`/company/applicants/${app._id}`}
                        className="px-4 py-2 rounded-lg
                                   bg-indigo-600 hover:bg-indigo-700
                                   text-white font-semibold"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredApplicants.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-16 text-center text-slate-600"
                >
                  No applicants match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
