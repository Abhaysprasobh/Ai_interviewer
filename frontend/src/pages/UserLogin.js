// app/user/login/page.js
"use client";

import { useState } from "react";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { setAuthToken, setUserRole, setUserEmail } from "@/app/_utils/auth";

export default function UserLogin() {
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
      const resp = await GlobalApi.loginUser({ email, password });
      
      // Store JWT token and user info
      setAuthToken(resp.data.token);
      setUserRole("user");
      setUserEmail(email);
      
      // Redirect to dashboard
      router.push("/user/dashboard");
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
        <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">AI Interviewer</h1>
            <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight">
              Master your next <br />
              <span className="text-indigo-400">Technical Interview</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-sm">
              Get real-time feedback, mock questions, and resume analysis powered by AI.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                <span>Real-time Answer Evaluation</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                <span>Resume Parsing & Analysis</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                <span>Voice-to-Text Integration</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            © 2024 AI Interviewer System
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Enter your details to access your dashboard.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
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
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                New here?{" "}
                <Link href="/user/register" className="text-indigo-600 font-medium hover:underline transition-all">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}