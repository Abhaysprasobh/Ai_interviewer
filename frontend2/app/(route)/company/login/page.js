// app/company/login/page.js
"use client";

import { useState } from "react";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, CheckCircle2, AlertCircle, ArrowRight, Building2 } from "lucide-react";
import { setAuthToken, setUserRole, setUserEmail } from "@/app/_utils/auth";

export default function CompanyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await GlobalApi.loginCompany({ email, password });

      setAuthToken(resp.data.token);
      setUserRole("company");
      setUserEmail(email);

      router.push("/company/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

        {/* LEFT SIDE: Branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-600 relative flex-col justify-between p-12 text-white">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">AI Hiring Platform</h1>
            </div>
            <div className="h-1 w-12 bg-white/40 rounded-full"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight">
              Find the Perfect <br />
              <span className="text-white/90">Candidates Faster</span>
            </h2>
            <p className="text-white/80 text-lg max-w-sm">
              AI-powered recruitment platform that helps you identify, interview, and hire top talent efficiently.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5" />
                <span>Automated Resume Screening</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5" />
                <span>AI-Powered Interviews</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5" />
                <span>Intelligent Candidate Ranking</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-white/60">
            © 2024 AI Hiring Platform
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Company Login</h2>
              <p className="text-slate-500">Access your recruitment dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Company Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    placeholder="hr@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Login to Dashboard</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                New to the platform?{" "}
                <Link href="/company/register" className="text-indigo-600 font-medium hover:underline">
                  Register your company
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}