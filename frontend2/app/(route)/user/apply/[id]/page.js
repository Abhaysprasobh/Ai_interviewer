// app/user/apply/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { isAuthenticated, isUser } from "@/app/_utils/auth";

import { FileText, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import GlobalApi from "@/app/_utils/GlobalApi";

export default function JobApply() {
    const params = useParams();
    const router = useRouter();

    const [job, setJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated() || !isUser()) {
            router.push("/user/login");
            return;
        }

        if (params.id) {
            fetchJobDetails();
        }
    }, [params.id]);

    const fetchJobDetails = async () => {
        try {
            const resp = await GlobalApi.getJobById(params.id);
            setJob(resp.data);
        } catch (err) {
            setError("Failed to load job details");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!validTypes.includes(file.type)) {
                setError("Please upload a PDF or Word document");
                return;
            }
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB");
                return;
            }
            setResume(file);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resume) {
            setError("Please upload your resume");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("jobId", params.id);
            formData.append("resume", resume);
            if (coverLetter) {
                formData.append("coverLetter", coverLetter);
            }

            await GlobalApi.applyToJob(formData);
            setSuccess(true);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push("/user/dashboard");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
                    <p className="text-slate-600 mb-6">
                        Your application has been successfully submitted. We'll review it and get back to you soon.
                    </p>
                    <Link
                        href="/user/dashboard"
                        className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <Link
                href={`/user/jobs/${params.id}`}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
            >
                ← Back to Job Details
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for Position</h1>
                {job && (
                    <p className="text-slate-600">
                        {job.title} at {job.companyId?.companyName}
                    </p>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8">
                {/* Resume Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Resume / CV <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-upload"
                            required
                        />
                        <label
                            htmlFor="resume-upload"
                            className="flex items-center justify-center gap-3 w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer group"
                        >
                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            <div className="text-center">
                                {resume ? (
                                    <div>
                                        <p className="font-medium text-slate-900">{resume.name}</p>
                                        <p className="text-sm text-slate-500">
                                            {(resume.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-medium text-slate-700">Click to upload resume</p>
                                        <p className="text-sm text-slate-500">PDF or Word (max 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        Supported formats: PDF, DOC, DOCX (Maximum size: 5MB)
                    </p>
                </div>

                {/* Cover Letter */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Cover Letter <span className="text-slate-500">(Optional)</span>
                    </label>
                    <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={8}
                        placeholder="Tell us why you're the perfect fit for this role..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-black"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                        A well-written cover letter can significantly improve your chances
                    </p>
                </div>

                {/* Info Box */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl opacity-100 text-black">
                <div className="flex gap-3">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 opacity-100 text-black" />
                    <div>
                    <h4 className="font-semibold text-blue-900 mb-1 opacity-100">
                        What happens next?
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1 opacity-100 text-black">
                        <li>• Your resume will be analyzed by our AI system</li>
                        <li>• You'll receive a compatibility score</li>
                        <li>• If shortlisted, you'll be invited for an AI interview</li>
                        <li>• The company will review your results</li>
                    </ul>
                    </div>
                </div>
                </div>


                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !resume}
                    className="w-full px-6 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting Application...
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5" />
                            Submit Application
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}