// app/jobs/page.js
"use client";

import { useState, useEffect } from "react";
import GlobalApi from "../_utils/GlobalApi";
import JobCard from "../_components/JobCard";
import { Search, Filter, Loader2, Briefcase, MapPin } from "lucide-react";

export default function PublicJobsListing() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchTerm, selectedSkill, selectedLocation, jobs]);

    const fetchJobs = async () => {
        try {
            const resp = await GlobalApi.getAllJobs();
            setJobs(resp.data || []);
            setFilteredJobs(resp.data || []);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = () => {
        let filtered = jobs;

        if (searchTerm) {
            filtered = filtered.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.companyId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedSkill) {
            filtered = filtered.filter((job) =>
                job.skills?.some((skill) => skill.toLowerCase() === selectedSkill.toLowerCase())
            );
        }

        if (selectedLocation) {
            filtered = filtered.filter((job) =>
                job.location?.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        setFilteredJobs(filtered);
    };

    const allSkills = [...new Set(jobs.flatMap((job) => job.skills || []))];
    const allLocations = [...new Set(jobs.map((job) => job.location).filter(Boolean))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse All Jobs</h1>
                <p className="text-slate-600">
                    Discover {jobs.length} opportunities from top companies
                </p>
            </div>

            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative md:col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by job title, company, or keywords..."
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Skill Filter */}
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                    >
                        <option value="">All Skills</option>
                        {allSkills.map((skill) => (
                            <option key={skill} value={skill}>
                                {skill}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedLocation("")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLocation === ""
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                >
                    All Locations
                </button>
                {allLocations.slice(0, 5).map((location) => (
                    <button
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedLocation === location
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        <MapPin className="w-4 h-4" />
                        {location}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                    Showing {filteredJobs.length} of {jobs.length} jobs
                </p>
                {(searchTerm || selectedSkill || selectedLocation) && (
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedSkill("");
                            setSelectedLocation("");
                        }}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        Clear all filters
                    </button>
                )}
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Found</h3>
                    <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedSkill("");
                            setSelectedLocation("");
                        }}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                    >
                        Show All Jobs
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}