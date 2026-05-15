"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    MapPin,
    Building2,
    Clock,
    Briefcase,
    DollarSign,
    Loader2,
    ArrowRight,
    CheckCircle
} from "lucide-react";
import GlobalApi from "@/app/_utils/GlobalApi";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await GlobalApi.getAllJobs();
            const sortedJobs = (res.data || []).sort((a, b) => {

                // Non-applied jobs first
                if (a.applied !== b.applied) {
                    return a.applied ? 1 : -1;
                }

                // Newest first
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setJobs(sortedJobs);
        } catch (err) {
            console.error(err);
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-slate-700" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h2 className="text-xl font-semibold mb-2">{error}</h2>
                    <button
                        onClick={fetchJobs}
                        className="text-indigo-600 underline"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-black">
                Open Jobs
            </h1>

            <div className="grid gap-6">
                {jobs.map((job) => {
                    const isApplied = job.applied === true;

                    return (
                        <div
                            key={job._id}
                            className="border rounded-xl p-6 bg-white transition hover:shadow-sm"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                {/* Job Info */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-2 text-black">
                                        {job.title}
                                    </h2>

                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                                        {job.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                        )}

                                        {job.experience && (
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {job.experience} years
                                            </span>
                                        )}

                                        {job.salary && (
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salary}
                                            </span>
                                        )}

                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatDate(job.createdAt)}
                                        </span>
                                    </div>

                                    {/* STATUS BADGE */}
                                    {isApplied ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                            Already applied
                                        </span>
                                    ) : (
                                        <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                                            Accepting applications
                                        </span>
                                    )}
                                </div>

                                {/* CTA */}
                                {isApplied ? (
                                    <Link
                                        href={`/user/jobs/${job._id}`}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-200 text-slate-600 cursor-not-allowed"
                                    >
                                        View Application
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/user/jobs/${job._id}`}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 whitespace-nowrap"
                                    >
                                        View Job
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
