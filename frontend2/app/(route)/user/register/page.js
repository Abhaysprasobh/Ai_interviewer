"use client";
import { useState } from 'react';
import GlobalApi from '../../../_utils/GlobalApi'; // Adjust path as needed
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Loader2, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobile: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sending data to your Flask /signup endpoint
      const resp = await GlobalApi.registerUser(formData);
      
      // On success (201 Created), redirect to Login
      if (resp) {
        router.push('/login'); 
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      
      {/* LEFT SIDE: Branding (Same as Login) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">AI Interviewer</h1>
            <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
        </div>
        <div className="relative z-10">
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
                Join the <br/>
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

      {/* RIGHT SIDE: Registration Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
        <div className="max-w-md mx-auto w-full">
            
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                <p className="text-slate-500">
                    Sign up to get started.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Full Name */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <input 
                            name="fullName"
                            type="text" 
                            required
                            className="block w-full text-slate-700 pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="John Doe"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <input 
                            name="email"
                            type="email" 
                            required
                            className="block w-full pl-10 pr-3 text-slate-700 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="student@example.com"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Mobile Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <input 
                            name="mobile"
                            type="tel" 
                            required
                            className="block w-full pl-10 pr-3 text-slate-700 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="+91 98765 43210"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <input 
                            name="password"
                            type="password" 
                            required
                            className="block w-full pl-10 text-slate-700 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <span>Register</span>
                            <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                    Already have an account? <Link href="./" className="text-indigo-600 font-medium hover:underline">Login here</Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}