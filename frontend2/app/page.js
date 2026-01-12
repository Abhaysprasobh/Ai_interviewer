// src/app/page.js
"use client";
import { useEffect, useState } from "react";
import Login from "./_components/Login";
import InterviewBot from "./_components/InterviewBot";
import ResumeParser from "./_components/ResumeParser";
import { LogOut } from "lucide-react"; // Optional icon

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // New State to track if parsing is successful
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar / Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-indigo-600 rounded-lg"></div>
           <span className="font-bold text-xl text-slate-800">AI Interviewer</span>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }} 
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </header>

      <main className="w-full px-6 py-8">
        
        {/* === SCENARIO 1: RESUME NOT PARSED YET (Centered View) === */}
        {!resumeData ? (
           <div className="max-w-3xl mx-auto mt-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                 <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Let's get you hired.
                 </h1>
                 <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    Upload your resume to generate a personalized AI interview session tailored to your skills and experience.
                 </p>
              </div>

              {/* Pass the setter to ResumeParser */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100">
                 <ResumeParser onResumeParsed={(data) => setResumeData(data)} />
              </div>
           </div>
        ) : (
           
        /* === SCENARIO 2: PARSING SUCCESS (Full Dashboard View) === */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
            
            {/* LEFT COLUMN: Sidebar / Tools (Takes 3/12 columns = 25%) */}
            <div className="lg:col-span-3 space-y-6">
               
               {/* Minimized Resume Parser (To re-upload if needed) */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Current Profile</h3>
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-4">
                     <p className="text-xs text-indigo-700 font-semibold">✅ Resume Active</p>
                  </div>
                  {/* You can pass a 'minimal' prop if you want to make it smaller */}
                  <ResumeParser onResumeParsed={(data) => setResumeData(data)} />
               </div>

               {/* Tips Box */}
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl text-white shadow-lg">
                  <h3 className="font-bold text-base mb-2 flex items-center gap-2">💡 Pro Tip</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Speak clearly. Our AI uses the <strong>Vosk 16kHz</strong> model. Short, concise answers score higher.
                  </p>
               </div>
            </div>

            {/* RIGHT COLUMN: AI Interviewer (Takes 9/12 columns = 75%) */}
            <div className="lg:col-span-9">
               {/* We pass the resume data to the bot so it knows context */}
               <InterviewBot resumeData={resumeData} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}