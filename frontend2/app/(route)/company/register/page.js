// app/company/register/page.js
"use client";

import { useState } from "react";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, User, Phone, Globe, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CompanyRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    contactPerson: "",
    contactNumber: "",
    website: "",
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
      const resp = await GlobalApi.registerCompany(formData);

      if (resp?.status === 201) {
        router.push("/company/login");
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

          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Transform Your <br />
              <span className="text-white/90">Hiring Process</span>
            </h2>
            <p className="text-white/80 text-lg max-w-sm">
              Join hundreds of companies using AI to streamline recruitment and find the best talent.
            </p>
          </div>

          <div className="relative z-10 text-xs text-white/60">
            © 2024 AI Hiring Platform
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Register Company</h2>
              <p className="text-slate-500">Start hiring smarter today</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Company Name */}
              <InputField
                icon={<Building2 />}
                name="companyName"
                placeholder="Acme Corp"
                required
                onChange={handleInputChange}
              />

              {/* Email */}
              <InputField
                icon={<Mail />}
                name="email"
                type="email"
                placeholder="hr@company.com"
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

              {/* Contact Person */}
              <InputField
                icon={<User />}
                name="contactPerson"
                placeholder="John Doe"
                required
                onChange={handleInputChange}
              />

              {/* Contact Number */}
              <InputField
                icon={<Phone />}
                name="contactNumber"
                type="tel"
                placeholder="+91 98765 43210"
                required
                onChange={handleInputChange}
              />

              {/* Website */}
              <InputField
                icon={<Globe />}
                name="website"
                type="url"
                placeholder="https://company.com"
                onChange={handleInputChange}
              />

              <button
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Register Company
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Already registered?{" "}
                <Link href="/company/login" className="text-indigo-600 font-medium hover:underline">
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
        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
      />
    </div>
  );
}