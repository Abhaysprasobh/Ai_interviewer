"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    FileText,
    Mail,
    Phone,
    Calendar,
    ArrowLeft,
    Loader2,
    CheckCircle,
    XCircle,
} from "lucide-react";

import GlobalApi from "@/app/_utils/GlobalApi";
import { isAuthenticated, isCompany } from "@/app/_utils/auth";
import StatusBadge from "@/app/_components/StatusBadge";

export default function ApplicantDetail() {
    const params = useParams();
    const router = useRouter();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!isAuthenticated() || !isCompany()) {
            router.push("/company/login");
            return;
        }

        if (params.id) fetchApplication();
    }, [params.id]);

    const fetchApplication = async () => {
        try {
            const resp = await GlobalApi.getApplicationDetails(params.id);
            setApplication(resp.data);
        } catch (err) {
            console.error("Failed to load application", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status) => {
        setUpdating(true);
        try {
            await GlobalApi.updateApplicationStatus(params.id, status);
            setApplication((prev) => ({ ...prev, status }));
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Application Not Found
                    </h2>
                    <Link href="/company/dashboard" className="text-indigo-600 hover:underline">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const { user, job } = application;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back */}
            <Link
                href={`/company/jobs/${job._id}`}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Applicants
            </Link>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            {user.fullName}
                        </h1>
                        <div className="space-y-1 text-slate-600">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                            {user.mobile && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{user.mobile}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <StatusBadge status={application.status} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <InfoBox label="Job Position" value={job.title} />
                    <InfoBox
                        label="Resume Score"
                        value={
                            application.aiResumeScore !== null
                                ? `${application.aiResumeScore}/100`
                                : "--"
                        }
                    />
                    <InfoBox
                        label="Applied On"
                        value={new Date(application.appliedAt).toLocaleDateString()}
                    />
                </div>

                {/* Resume */}
                {application.resumeUrl && (
                    <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition mb-6"
                    >
                        <FileText className="w-5 h-5" />
                        View Resume
                    </a>
                )}

                {/* Cover Letter */}
                {application.coverLetter && (
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-900 mb-2">Cover Letter</h3>
                        <p className="text-slate-700 whitespace-pre-line">
                            {application.coverLetter}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                    <ActionButton
                        onClick={() => updateStatus("shortlisted")}
                        disabled={updating || application.status === "shortlisted"}
                        className="bg-green-600 hover:bg-green-700"
                        icon={<CheckCircle className="w-5 h-5" />}
                        label="Shortlist"
                    />

                    <ActionButton
                        onClick={() => updateStatus("rejected")}
                        disabled={updating || application.status === "rejected"}
                        className="bg-red-600 hover:bg-red-700"
                        icon={<XCircle className="w-5 h-5" />}
                        label="Reject"
                    />

                    <ActionButton
                        onClick={() => updateStatus("interview_scheduled")}
                        disabled={updating}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        label="Schedule Interview"
                    />
                </div>
            </div>
        </div>
    );
}

/* ---------- Small Components ---------- */

function InfoBox({ label, value }) {
    return (
        <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-1">{label}</div>
            <div className="font-bold text-slate-900">{value}</div>
        </div>
    );
}

function ActionButton({ onClick, disabled, className, icon, label }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition disabled:opacity-50 ${className}`}
        >
            {icon}
            {label}
        </button>
    );
}
