"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, Building2, ChevronDown } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-6 md:px-20">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-slate-900"
        >
          AI<span className="text-indigo-600">Interviewer</span>
        </Link>

        {/* Auth */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-6 py-3 rounded-full
                       bg-indigo-600 text-white text-sm font-semibold
                       shadow-md hover:shadow-lg
                       hover:bg-indigo-500
                       transition-all duration-300"
          >
            Login / Register
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="absolute right-0 mt-4 w-56 rounded-2xl
                         bg-white shadow-xl border border-slate-200
                         px-2 py-2
                         animate-in fade-in zoom-in-95"
            >
              <Link
                href="/user/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3
                           px-4 py-3 rounded-xl
                           text-sm font-medium text-slate-700
                           hover:bg-indigo-50 hover:text-indigo-600
                           transition"
              >
                <User size={18} />
                Job Seeker
              </Link>

              <Link
                href="/company/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3
                           px-4 py-3 mt-1 rounded-xl
                           text-sm font-medium text-slate-700
                           hover:bg-indigo-50 hover:text-indigo-600
                           transition"
              >
                <Building2 size={18} />
                Company
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
