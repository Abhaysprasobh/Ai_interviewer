"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  Building2,
  LogOut,
  Briefcase,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { isAuthenticated, getUserRole, logout } from "../_utils/auth";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isAuth = useMemo(() => isAuthenticated(), [pathname]);
  const role = useMemo(() => getUserRole(), [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const linkBase = "px-3 py-2 text-sm font-medium rounded-md transition-colors";

  const linkInactive = "text-slate-700 hover:bg-slate-100";
  const linkActive = "bg-slate-200 text-slate-900";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                <span className="font-extrabold text-2xl sm:text-3xl text-slate-900">
                  AI<span className="text-indigo-600">Hiring</span>
                </span>
                </Link>

                {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAuth ? (
              <>
                {/* <Link
                  href="/jobs"
                  className={`${linkBase} ${
                    pathname === "/jobs" ? linkActive : linkInactive
                  }`}
                >
                  Browse Jobs
                </Link> */}
                <Link
                  href="/user/login"
                  className={`${linkBase} ${linkInactive}`}
                >
                  Job Seekers
                </Link>
                <Link
                  href="/company/login"
                  className={`${linkBase} ${linkInactive}`}
                >
                  Companies
                </Link>
                {/* <Link
                  href="/user/register"
                  className="ml-2 px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-100 transition text-black"
                >
                  Get Started
                </Link> */}
              </>
            ) : (
              <>
                {role === "user" && (
                  <>
                    <Link
                      href="/user/jobs"
                      className={`${linkBase} ${
                        pathname === "/user/jobs" ? linkActive : linkInactive
                      }`}
                    >
                      Browse Jobs
                    </Link>
                    <Link
                      href="/user/dashboard"
                      className={`${linkBase} ${
                        pathname === "/user/dashboard"
                          ? linkActive
                          : linkInactive
                      }`}
                    >
                      My Applications
                    </Link>
                    {/* <Link
                      href="/user/profile"
                      className={`${linkBase} ${
                        pathname === "/user/profile" ? linkActive : linkInactive
                      }`}
                    >
                      Profile
                    </Link> */}
                  </>
                )}

                {role === "company" && (
                  <>
                    <Link
                      href="/company/dashboard"
                      className={`${linkBase} ${
                        pathname === "/company/dashboard"
                          ? linkActive
                          : linkInactive
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/company/jobs"
                      className={`${linkBase} ${
                        pathname.startsWith("/company/jobs")
                          ? linkActive
                          : linkInactive
                      }`}
                    >
                      My Jobs
                    </Link>
                    <Link
                      href="/company/jobs/create"
                      className="ml-3 px-4 py-2 text-sm hover:bg-slate-100 transition text-black"
                    >
                      Post Job
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {!isAuth ? (
              <>
                {/* <Link href="/jobs" className={`${linkBase} ${linkInactive}`}>
                  Browse Jobs
                </Link>
                <Link
                  href="/user/login"
                  className={`${linkBase} ${linkInactive}`}
                >
                  Job Seeker Login
                </Link>
                <Link
                  href="/company/login"
                  className={`${linkBase} ${linkInactive}`}
                >
                  Company Login
                </Link>
                <Link
                  href="/user/register"
                  className="mt-2 px-4 py-2 border border-slate-300 rounded-md text-sm text-center hover:bg-slate-100"
                >
                  Get Started
                </Link> */}
              </>
            ) : (
              <>
                {role === "user" && (
                  <>
                    <Link
                      href="/jobs"
                      className={`${linkBase} ${linkInactive}`}
                    >
                      Browse Jobs
                    </Link>
                    <Link
                      href="/user/dashboard"
                      className={`${linkBase} ${linkInactive}`}
                    >
                      My Applications
                    </Link>
                    <Link
                      href="/user/profile"
                      className={`${linkBase} ${linkInactive}`}
                    >
                      Profile
                    </Link>
                  </>
                )}

                {role === "company" && (
                  <>
                    {/* <Link
                      href="/company/dashboard"
                      className={`${linkBase} ${linkInactive}`}
                    >
                      Dashboard
                    </Link> */}
                    <Link
                      href="/company/dashboard"
                      className={`${linkBase} ${linkInactive}`}
                    >
                      My Jobs
                    </Link>
                    <Link
                      href="/company/jobs/create"
                      className={`${linkBase} ${linkInactive}`}
                    >
                      Post Job
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="mt-2 px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
