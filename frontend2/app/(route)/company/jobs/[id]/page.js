"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import GlobalApi from "@/app/_utils/GlobalApi";

import { isAuthenticated, isCompany } from "@/app/_utils/auth";
import ApplicantsTable from "@/app/_components/ApplicantTable";

export default function JobApplicants() {
    const params = useParams();
    const router = useRouter();

    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingStatus, setPendingStatus] = useState("");

    // ATS controls
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("appliedAt");

    useEffect(() => {
        if (!isAuthenticated() || !isCompany()) {
            router.push("/company/login");
            return;
        }
        fetchData();
    }, [params.id, search, statusFilter, sortBy]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobResp, applicantsResp] = await Promise.all([
                GlobalApi.getJobById(params.id),
                GlobalApi.getJobApplicants(params.id, {
                    search,
                    status: statusFilter,
                    sort: sortBy,
                }),
            ]);
            setJob(jobResp.data);
            setApplicants(applicantsResp.data?.results || applicantsResp.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleJobStatus = async () => {
        const newStatus = job.status === "active" ? "closed" : "active";
        await GlobalApi.updateJob(params.id, { status: newStatus });
        setJob({ ...job, status: newStatus });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <Link
                href="/company/dashboard"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Job Header */}
            {job && (
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
                            <p className="text-slate-600 mt-1">
                                {applicants.length} applications
                            </p>
                        </div>

                        <button
                            onClick={toggleJobStatus}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${job.status === "active"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                        >
                            {job.status === "active" ? "Close Job" : "Reopen Job"}
                        </button>
                    </div>
                </div>
            )}


            {/* Table */}
            {applicants.length === 0 ? (
                <div className="bg-white border rounded-xl p-10 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No applicants</h3>
                </div>
            ) : (
                <ApplicantsTable jobId={params.id} applicants={applicants} />
            )}
        </div>
    );
}
