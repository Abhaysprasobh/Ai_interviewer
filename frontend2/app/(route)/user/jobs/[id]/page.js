// app/user/jobs/[id]/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { MapPin, Building2, Clock, Briefcase, DollarSign, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import GlobalApi from "@/app/_utils/GlobalApi";

export default function JobDetail() {
    const params = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchJobDetails = useCallback(async () => {
        try {
            const resp = await GlobalApi.getJobById(params.id);
            setJob(resp.data);
        } catch (err) {
            console.error("Failed to fetch job:", err);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) {
            fetchJobDetails();
        }
    }, [fetchJobDetails]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
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

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Not Found</h2>
                    <p className="text-slate-600 mb-6">This job posting may have been removed.</p>
                    <Link
                        href="/user/jobs"
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                    >
                        Browse All Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <Link
                href="/user/jobs"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
            >
                ← Back to Jobs
            </Link>

            {/* Job Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">{job.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                <span className="font-medium">{job.companyId?.companyName}</span>
                            </div>
                            {job.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>{job.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>Posted {formatDate(job.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6">
                            {job.experience && (
                                <div className="px-4 py-2 bg-slate-100 rounded-lg flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">{job.experience}</span>
                                </div>
                            )}
                            {job.salary && (
                                <div className="px-4 py-2 bg-slate-100 rounded-lg flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">{job.salary}</span>
                                </div>
                            )}
                            <div
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${job.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {job.status === "active" ? "Accepting Applications" : "Closed"}
                            </div>
                        </div>
                    </div>

                    {/* Apply Button */}
                    <Link
                        href={`/user/apply/${job._id}`}
                        className="px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group lg:self-start"
                    >
                        Apply Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Job Description</h2>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {job.description}
                    </p>
                </div>
            </div>

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {job.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium border border-indigo-200"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Company Info */}
            {job.companyId && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Company</h2>
                    <div className="space-y-3">
                        <div>
                            <span className="text-slate-600">Company Name:</span>
                            <span className="ml-2 font-medium text-slate-900">
                                {job.companyId.companyName}
                            </span>
                        </div>
                        {job.companyId.website && (
                            <div>
                                <span className="text-slate-600">Website:</span>
                                <a
                                    href={job.companyId.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-indigo-600 hover:underline"
                                >
                                    {job.companyId.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Apply Button */}
            <div className="mt-8 text-center">
                <Link
                    href={`/user/apply/${job._id}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all group"
                >
                    Apply for this Position
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
