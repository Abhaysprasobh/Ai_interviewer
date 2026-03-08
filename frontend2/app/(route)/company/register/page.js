"use client";
import { useState } from "react";
import GlobalApi from "../../../_utils/GlobalApi";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  Phone,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function CompanyRegister() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await GlobalApi.registerCompany(formData);

      if (resp) {
        router.push("/company/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Company registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      {/* LEFT BRANDING */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 text-white flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Interviewer</h1>
          <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold mb-4">
            Hire Smarter with <br />
            <span className="text-indigo-400">AI Interviews</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Register your company and start screening candidates automatically.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          © 2024 AI Interviewer System
        </div>
      </div>

      {/* FORM */}
      <div className="w-full md:w-1/2 p-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-slate-900 font-bold mb-2">Company Registration</h2>
            <p className="text-slate-500">
              Create your company account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="text-sm  text-slate-700 font-semibold">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  name="companyName"
                  required
                  onChange={handleInputChange}
                  className="w-full text-slate-900 pl-10 py-3 border rounded-xl"
                  placeholder="Google Inc."
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-slate-700 font-semibold">Company Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  onChange={handleInputChange}
                  className="w-full pl-10 text-slate-900 py-3 border rounded-xl"
                  placeholder="hr@company.com"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-sm text-slate-700 font-semibold">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  name="contactNumber"
                  required
                  onChange={handleInputChange}
                  className="w-full pl-10 py-3 text-slate-900 border rounded-xl"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-700 font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  required
                  onChange={handleInputChange}
                  className="w-full text-slate-900 pl-10 py-3 border rounded-xl"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl flex justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register Company <ArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already registered?{" "}
            <Link
              href="/company/login"
              className="text-indigo-600 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
