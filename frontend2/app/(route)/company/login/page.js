"use client";

import { useState } from "react";
import Link from "next/link";
import GlobalApi from "@/app/_utils/GlobalApi";


import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";

export default function CompanyLogin() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: connect backend API here
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

      {/* LEFT: Branding (same style as user auth) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            AI Interviewer
          </h1>
          <div className="h-1 w-12 bg-indigo-500 rounded-full" />
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Hire Smarter <br />
            <span className="text-indigo-400">with AI</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm">
            Login to manage job postings, review AI-scored candidates, and
            streamline your hiring process.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2024 AI Interviewer System
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
        <div className="max-w-md mx-auto w-full">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                <Building2 className="h-6 w-6" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Company Login
            </h2>
            <p className="text-slate-500">
              Access your hiring dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Company Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="company@example.com"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl
                             focus:ring-2 focus:ring-indigo-500/20
                             focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl
                             focus:ring-2 focus:ring-indigo-500/20
                             focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold
                         py-3.5 rounded-xl transition-all duration-300
                         disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Don’t have a company account?{" "}
            <Link
              href="/company/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Register
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-indigo-600"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
