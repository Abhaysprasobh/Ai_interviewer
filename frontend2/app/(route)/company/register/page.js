"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Building2,
  User,
  Phone,
  Globe,
} from "lucide-react";
import GlobalApi from "@/app/_utils/GlobalApi";

export default function CompanySignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    companyName: "",
    contactPerson: "",
    contactNumber: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await GlobalApi.registerCompany(form);
      router.push("/company/login");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Company Signup
        </h1>
        <p className="text-slate-600 mb-6">
          Create your company account
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <Input
            icon={<Building2 size={18} />}
            placeholder="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
          />

          {/* Contact Person */}
          <Input
            icon={<User size={18} />}
            placeholder="Contact Person"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            icon={<Mail size={18} />}
            placeholder="Company Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <Input
            icon={<Phone size={18} />}
            placeholder="Contact Number"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
          />

          {/* Website */}
          <Input
            icon={<Globe size={18} />}
            placeholder="Website (optional)"
            name="website"
            value={form.website}
            onChange={handleChange}
          />

          {/* Password */}
          <Input
            icon={<Lock size={18} />}
            placeholder="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl
                       bg-indigo-600 text-white font-semibold
                       hover:bg-indigo-500
                       transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Company Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/company/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------- Input Component ---------- */

function Input({ icon, ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-indigo-500 transition">
      <span className="text-slate-400">{icon}</span>
      <input
        {...props}
        className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
      />
    </div>
  );
}
