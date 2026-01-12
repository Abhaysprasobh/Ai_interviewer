// app/company/jobs/create/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


import { isAuthenticated, isCompany } from "@/app/_utils/auth";
import { Briefcase, MapPin, DollarSign, Clock, Tag, Loader2, ChecgkCircle, CheckCircle } from "lucide-react";
import GlobalApi from "@/app/_utils/GlobalApi";

export default function CreateJob() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        skills: "",
        experience: "",
        salary: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated() || !isCompany()) {
            router.push("/company/login");
            return;
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convert skills string to array
            const jobData = {
                ...formData,
                skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
            };

            await GlobalApi.createJob(jobData);
            setSuccess(true);

            setTimeout(() => {
                router.push("/company/dashboard");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create job");
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Posted Successfully!</h2>
                    <p className="text-slate-600">Your job posting is now live and accepting applications.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Post a New Job</h1>
                <p className="text-slate-600">Fill in the details to create your job posting</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-700">
                    {error}
                </div>
            )}

            {/* Job Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
                {/* Job Title */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Job Title <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Senior Frontend Developer"
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 caret-slate-900"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ">
                        Job Description <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={8}
                        placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none  bg-white text-slate-900 placeholder:text-slate-400 caret-slate-900"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Location
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Remote, New York, Hybrid"
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 caret-slate-900"
                        />
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Required Skills <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="skills"
                            required
                            value={formData.skills}
                            onChange={handleInputChange}
                            placeholder="React, TypeScript, Node.js (comma-separated)"
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 caret-slate-900"
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Separate skills with commas</p>
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Experience Required
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            placeholder="e.g., 3-5 years"
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 caret-slate-900"
                        />
                    </div>
                </div>

                {/* Salary */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Salary Range
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                            placeholder="e.g., $80k - $120k, 15-25 LPA"
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 caret-slate-900"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Job...
                        </>
                    ) : (
                        <>
                            <Briefcase className="w-5 h-5" />
                            Post Job
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}