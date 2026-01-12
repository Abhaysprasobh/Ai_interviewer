
const statusConfig = {
  submitted: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  reviewed: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  interview_scheduled: {
    label: "Interview Scheduled",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  interview_completed: {
    label: "Interview Completed",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.submitted;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
    >
      {config.label}
    </span>
  );
}