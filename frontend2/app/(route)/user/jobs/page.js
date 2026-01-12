"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    MapPin,
    Clock,
    Briefcase,
    DollarSign,
    Loader2,
    ArrowRight
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
            setJobs(res.data || []);
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
                <Loader2 className="w-10 h-10 animate-spin text-slate-800" />
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

    if (jobs.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2">No jobs available</h2>
                    <p className="text-slate-600">
                        Check back later for new opportunities.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-black">Open Jobs</h1>

            <div className="grid gap-6">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className="border rounded-xl p-6 bg-white hover:shadow-sm transition"
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
                                            {job.experience}
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

                                <span
                                    className={`inline-block px-3 py-1 rounded text-xs font-medium ${job.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {job.status === "active"
                                        ? "Accepting applications"
                                        : "Closed"}
                                </span>
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/user/jobs/${job._id}`}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-lg hover:bg-slate-800 whitespace-nowrap"
                            >
                                View Job
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
