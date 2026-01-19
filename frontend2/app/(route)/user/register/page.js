// app/user/register/page.js
"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import GlobalApi from "@/app/_utils/GlobalApi";

import { User, Mail, Lock, Phone, Loader2, ArrowRight, AlertCircle } from "lucide-react";

export default function UserRegister() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        mobile: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const resp = await GlobalApi.registerUser(formData);

            if (resp?.status === 201) {
                router.push("/user/login");
            }
        } catch (err) {
            setError(err?.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                {/* LEFT SIDE */}
                <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Interviewer</h1>
                        <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-extrabold leading-tight mb-4">
                            Join the <br />
                            <span className="text-indigo-400">Future of Hiring</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-sm">
                            Create your account to start practicing mock interviews and get instant AI feedback.
                        </p>
                    </div>

                    <div className="relative z-10 text-xs text-slate-500">
                        © 2024 AI Interviewer System
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                            <p className="text-slate-500">Sign up to get started.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
                                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-5">
                            {/* Full Name */}
                            <InputField
                                icon={<User />}
                                name="fullName"
                                placeholder="John Doe"
                                required
                                onChange={handleInputChange}
                            />

                            {/* Email */}
                            <InputField
                                icon={<Mail />}
                                name="email"
                                type="email"
                                placeholder="student@example.com"
                                required
                                onChange={handleInputChange}
                            />

                            {/* Mobile */}
                            <InputField
                                icon={<Phone />}
                                name="mobile"
                                type="tel"
                                placeholder="+91 98765 43210"
                                required
                                onChange={handleInputChange}
                            />

                            {/* Password */}
                            <InputField
                                icon={<Lock />}
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                onChange={handleInputChange}
                            />

                            <button
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Register
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link href="/user/login" className="text-indigo-600 font-medium hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ icon, ...props }) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">{icon}</span>
            <input
                {...props}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 caret-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
        </div>
    );
}