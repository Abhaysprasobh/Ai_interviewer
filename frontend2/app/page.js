// src/app/page.js
"use client";
import { useEffect, useState } from "react";
import Login from "./_components/Login";
import InterviewBot from "./_components/InterviewBot";
import ResumeParser from "./_components/ResumeParser";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for JWT token existence [cite: 63]
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Interview Interface (Occupies 2/3 width on large screens) */}
      <div className="lg:col-span-2">
         <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">Mock Interview</h1>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }} 
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Logout
            </button>
         </div>
               {/* Right Column: Resume Parser & Utils */}
      <div className="lg:col-span-1 space-y-6">
        <h2 className="text-xl font-bold text-slate-800 pt-1">Tools</h2>
        <ResumeParser />
        
        {/* Placeholder for future Speech Status or Stats */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
           <h3 className="font-bold text-lg mb-1">Pro Tip</h3>
           <p className="text-indigo-100 text-sm leading-relaxed">
             Ensure your microphone is set to 16kHz Mono when using voice features for best results with Vosk.
           </p>
        </div>
      </div>
         <InterviewBot />
      </div>
    </div>
  );
}