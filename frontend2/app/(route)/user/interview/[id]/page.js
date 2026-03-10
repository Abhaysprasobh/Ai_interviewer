"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import GlobalApi from "@/app/_utils/GlobalApi";
import InterviewBot from "@/app/_components/InterviewBot";

export default function InterviewPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplication();
    }, [params.id]);

    const fetchApplication = async () => {
        try {
            setLoading(true);
            const response = await GlobalApi.getApplicationDetails(params.id);

            // Check if interview is available
            if (response.data.status !== "interview_scheduled") {
                setError("Interview not available for this application");
                return;
            }

            setApplication(response.data);
        } catch (err) {
            console.error("Failed to fetch application:", err);
            setError("Failed to load interview");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="text-slate-600">Loading interview...</p>
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-md border border-red-200 max-w-md">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-slate-700 mb-4">{error || "Application not found"}</p>
                    <button
                        onClick={() => router.push("/user/dashboard")}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-semibold"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/user/dashboard")}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                AI Interview - {application.job.title}
                            </h1>
                            <p className="text-sm text-slate-500">
                                Application ID: {application._id}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Interview Component */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <InterviewBot
                    applicationId={params.id}
                    jobTitle={application.job.title}
                />
            </main>
        </div>
    );
}