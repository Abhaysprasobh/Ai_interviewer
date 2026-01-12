"use client";

import Link from "next/link";
import {
    Briefcase,
    Building2,
    CheckCircle2,
    ArrowRight,
    Zap,
    Target,
    Users,
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl shadow-lg mb-12">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

                <div className="relative px-8 py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <Zap className="h-4 w-4" />
                            AI-Powered Hiring Platform
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Hire Smarter with
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                AI-Driven Interviews
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                            Streamline your recruitment process with AI-powered resume
                            analysis and intelligent interviews. Find the perfect candidates
                            faster than ever.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/user/register"
                                className="group flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Briefcase className="h-5 w-5" />
                                I'm a Job Seeker
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/company/register"
                                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-indigo-50 text-slate-900 border-2 border-slate-200 hover:border-indigo-300 rounded-xl font-semibold text-lg transition-all"
                            >
                                <Building2 className="h-5 w-5" />
                                I'm a Company
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="mb-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">
                        Why Choose Our Platform?
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Cutting-edge AI technology meets intuitive design
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Target className="h-8 w-8" />}
                        title="AI Resume Analysis"
                        description="Automatically score and rank candidates based on skills, experience, and job requirements."
                    />
                    <FeatureCard
                        icon={<Users className="h-8 w-8" />}
                        title="Smart Interviews"
                        description="AI-powered interviews with real-time evaluation and personalized feedback for candidates."
                    />
                    <FeatureCard
                        icon={<CheckCircle2 className="h-8 w-8" />}
                        title="Instant Results"
                        description="Get comprehensive candidate reports instantly with detailed insights and recommendations."
                    />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-white rounded-3xl shadow-lg p-12 mb-12">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
                    How It Works
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* For Job Seekers */}
                    <div>
                        <h3 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
                            <Briefcase className="h-6 w-6" />
                            For Job Seekers
                        </h3>
                        <div className="space-y-4">
                            <Step number="1" text="Create your profile and browse jobs" />
                            <Step number="2" text="Apply with your resume" />
                            <Step number="3" text="Take AI-powered interview" />
                            <Step number="4" text="Get instant feedback and results" />
                        </div>
                    </div>

                    {/* For Companies */}
                    <div>
                        <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                            <Building2 className="h-6 w-6" />
                            For Companies
                        </h3>
                        <div className="space-y-4">
                            <Step number="1" text="Post job openings" />
                            <Step number="2" text="AI analyzes all applications" />
                            <Step number="3" text="Review ranked candidates" />
                            <Step number="4" text="Schedule interviews and hire" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl shadow-2xl p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                    Join thousands of companies and job seekers using AI to make better
                    hiring decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/user/register"
                        className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
                    >
                        Sign Up as Job Seeker
                    </Link>
                    <Link
                        href="/company/register"
                        className="px-8 py-4 bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-800 transition-all border-2 border-white/20"
                    >
                        Sign Up as Company
                    </Link>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    );
}

function Step({ number, text }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">
                {number}
            </div>
            <p className="text-slate-700 pt-1">{text}</p>
        </div>
    );
}