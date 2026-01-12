"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ApplicantCard from "@/app/_components/ApplicantCard";
import { Loader2, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import GlobalApi from "@/app/_utils/GlobalApi";
import { isAuthenticated, isCompany } from  "@/app/_utils/auth";

export default function JobApplicants() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated() || !isCompany()) {
            router.push("/company/login");
            return;
        }

        if (params.id) {
            fetchJobAndApplicants();
        }
    }, [params.id]);

    const fetchJobAndApplicants = async () => {
        try {
            const [jobResp, applicantsResp] = await Promise.all([
                GlobalApi.getJobById(params.id),
                GlobalApi.getJobApplicants(params.id)
            ]);
            setJob(jobResp.data);
            setApplicants(applicantsResp.data || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/company/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {job && (
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{job.title}</h1>
                    <p className="text-slate-600">{applicants.length} total applications</p>
                </div>
            )}

            {applicants.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications Yet</h3>
                    <p className="text-slate-600">Check back later for new applicants</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {applicants.map((applicant) => (
                        <ApplicantCard key={applicant._id} application={applicant} />
                    ))}
                </div>
            )}
        </div>
    );
}