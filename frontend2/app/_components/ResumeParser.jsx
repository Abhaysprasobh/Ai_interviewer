// src/components/ResumeParser.jsx
"use client";
import { useState } from 'react';
import GlobalApi from '../_utils/GlobalApi';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function ResumeParser() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    // Create FormData for multipart/form-data request [cite: 162]
    const formData = new FormData();
    formData.append('resume', file); // Key 'resume' matches API doc [cite: 164]

    try {
      const resp = await GlobalApi.parseResume(formData);
      setParsedData(resp.data.parsed_resume);
    } catch (error) {
      alert("Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-500"/> Resume Analysis
      </h3>
      
      {!parsedData ? (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative">
          <input 
            type="file" 
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
             <Upload className="h-10 w-10 text-slate-400 mb-3"/>
             <p className="text-sm font-medium text-slate-600">
               {file ? file.name : "Click to upload Resume (PDF/Img)"}
             </p>
          </div>
          {file && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleUpload(); }}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium w-full z-10 relative hover:bg-indigo-700"
            >
              {loading ? 'Extracting Data...' : 'Analyze Resume'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Education</h4>
            <p className="text-slate-800 text-sm">{parsedData.education}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Experience</h4>
            <p className="text-slate-800 text-sm">{parsedData.experience}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Skills Detected</h4>
             <div className="flex flex-wrap gap-2">
                {parsedData.skills?.map((skill, i) => (
                  <span key={i} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
             </div>
          </div>
          <button 
            onClick={() => {setParsedData(null); setFile(null);}}
            className="w-full text-slate-500 text-sm hover:text-slate-800"
          >
            Upload Different Resume
          </button>
        </div>
      )}
    </div>
  );
}