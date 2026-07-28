// src/components/InterviewBot.jsx
"use client";
import { useState, useRef, useEffect } from 'react';
import GlobalApi from '../_utils/GlobalApi';
import { Mic, Send, Loader2, Play, StopCircle, Sparkles, ArrowRight, FileText, XCircle, BarChart, CheckCircle,Settings, Volume2, VolumeX } from 'lucide-react';

export default function InterviewBot({ resumeData, applicationId, jobTitle }) {
  const [role, setRole] = useState(jobTitle || '');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [nextQ, setNextQ] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // New States for 7-Question Loop & Dashboard
  const [qNumber, setQNumber] = useState(0);
  const [totalQ, setTotalQ] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Speech State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [skills, setSkills] = useState([]);

  // Audio Control States
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const audioPlayerRef = useRef(null);
  const isAudioEnabledRef = useRef(isAudioEnabled); // Safe tracking for async closures

  // Keep the ref synced with state
  useEffect(() => {
    isAudioEnabledRef.current = isAudioEnabled;
  }, [isAudioEnabled]);

  // The Toggle Function
  const toggleAudio = () => {
    setIsAudioEnabled(prev => {
      const newState = !prev;
      // If they are turning it off, instantly pause any audio currently speaking!
      if (!newState && audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      return newState;
    });
  };

  useEffect(() => {
    if (resumeData && resumeData.skills) {
      setSkills(resumeData.skills);
    }
  }, [resumeData]);

    // 2. The Full Screen Monitor
  useEffect(() => {
    const handleFullScreenChange = () => {
      // If the browser is no longer in full screen, AND the interview is active
      if (!document.fullscreenElement && question !== null && !isComplete) {
        abortInterviewForCheating();
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, [question, isComplete, qNumber]);

// 1. Function to immediately fail the interview
  const abortInterviewForCheating = async () => {
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    if (isRecording) stopRecording(); // Stop the mic immediately
    
    alert("🚨 INTERVIEW TERMINATED: You exited full-screen mode. This has been logged as a proctoring violation.");
    
    setIsComplete(true);
    
    // Create a failed dashboard state directly
    setDashboardData({
      overall_score_percentage: 0,
      average_technical: 0,
      average_communication: 0,
      summary: "Interview was automatically terminated due to a proctoring violation (exited full-screen mode).",
      detailed_breakdown: []
    });

    // Send the failure to the backend using GlobalApi!
    try {
      await GlobalApi.abortInterview({
        application_id: applicationId,
        reason: "Exited Full Screen Mode",
        questions_completed: qNumber
      });
    } catch (err) {
      console.error("Failed to notify backend of abortion:", err);
    }
  };

  const endInterview = () => {
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    if (isRecording) stopRecording();
    setQuestion(null);
    setAnswer('');
    setFeedback(null);
    setSessionId(null);
    setNextQ(null);
    setLoading(false);
    setIsComplete(false);
    setDashboardData(null);
    setQNumber(0);
    setShowDetails(false);
  };

  // --- NEW: Play AI Voice ---
  const playQuestionAudio = async (textToRead) => {
    if (!isAudioEnabledRef.current) return; // Skip if muted

    try {
      const resp = await GlobalApi.textToSpeech({ text: textToRead });
      
      // Check again in case they muted it while the API was loading!
      if (!isAudioEnabledRef.current) return; 

      const audioUrl = URL.createObjectURL(resp.data);
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio; // Save it to the ref so we can stop it later
      audio.play();
    } catch (error) {
      console.error("TTS failed to play:", error);
    }
  };

// 1. Start Interview
  const startInterview = async () => {
    if (!role) return alert("Please enter a target Job Role to start.");

    setLoading(true);

    // --- STEP 1: PRE-FLIGHT MIC CHECK ---
    // Ask for permission BEFORE going full screen to avoid triggering the proctoring trap.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // They clicked "Allow"! Stop the tracks immediately so we don't leave the red dot on their tab.
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionGranted(true);
    } catch (err) {
      console.error("Microphone permission denied:", err);
      alert("🚨 Microphone access is required for this interview. Please click the lock icon in your URL bar, allow the microphone, and try again.");
      setLoading(false);
      return; // Stop the execution completely
    }

    // --- STEP 2: PROCTORING TRIGGER ---
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      alert("🚨 You must allow full-screen mode to start this proctored interview.");
      setLoading(false);
      return; 
    }
    // -----------------------------------------------------------

    setFeedback(null);
    setAnswer('');
    setQuestion(null);
    setIsComplete(false);
    
    try {
      const dataToSend = {
        role: role, 
        skills: skills,
        application_id: applicationId || null, 
        education: resumeData?.education || "",
        experience: resumeData?.experience || ""
      };

      const resp = await GlobalApi.startInterview(dataToSend);
      setQuestion(resp.data.question);
      setSessionId(resp.data.session_id); 
      setQNumber(resp.data.question_number);
      setTotalQ(resp.data.total_questions);

      // Trigger Voice
      playQuestionAudio(resp.data.question);

    } catch (error) {
      console.error(error);
      alert("Error starting interview");
      
      // Safety net: If the API fails to start, safely exit full screen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    } finally {
      setLoading(false);
    }
  };

// 2. Submit Answer
  const submitResponse = async () => {
    if (!answer) return;
    setLoading(true);
    try {
      const resp = await GlobalApi.submitAnswer({
        question: question,
        answer: answer,
        session_id: sessionId 
      });
      
      setFeedback(resp.data.feedback);
      
      // FIX: Don't set isComplete(true) here! Just stage the data so they can read the feedback.
      if (resp.data.is_complete) {
        setDashboardData(resp.data.dashboard);
        setNextQ(null);
      } else {
        setNextQ(resp.data.next_question);
        setQNumber(resp.data.question_number);
      }

    } catch (error) {
      console.error(error);
      alert("Error evaluating answer");
    } finally {
      setLoading(false);
    }
  };

  // 3. Load Next Question
  // 3. Handle Next Question OR Finish Interview
  const handleNextAction = () => {
    // If we have dashboard data staged, it means the interview is over!
    if (dashboardData) {
      setIsComplete(true); // THIS officially triggers the dashboard render

      // Safely exit full-screen proctoring naturally
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    } 
    // Otherwise, just load the next question
    else if (nextQ) {
      setQuestion(nextQ);     
      setAnswer('');          
      setFeedback(null);      
      playQuestionAudio(nextQ); 
      setNextQ(null);         
    }
  };

  // --- Voice Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        if (audioBlob.size < 1000) {
           alert("Recording was too short. Please speak longer.");
           setIsRecording(false);
           return;
        }

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        setLoading(true);
        try {
          const resp = await GlobalApi.transcribeAudio(formData);
          if (resp.data.text) {
             setAnswer(prev => prev + (prev ? " " : "") + resp.data.text);
          }
        } catch (error) {
          console.error("Transcription failed:", error);
          alert("Could not transcribe audio.");
        } finally {
          setLoading(false);
          setIsRecording(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  if (isComplete && dashboardData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col p-8 overflow-y-auto">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Interview Complete!</h2>
          <p className="text-slate-500 mt-2">Here is your performance summary.</p>
        </div>

        {/* High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500 uppercase">Overall Score</p>
            <p className="text-4xl font-black text-indigo-600 mt-2">{dashboardData.overall_score_percentage}%</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500 uppercase">Avg Technical</p>
            <p className="text-4xl font-black text-slate-700 mt-2">{dashboardData.average_technical} <span className="text-lg text-slate-400">/ 10</span></p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500 uppercase">Avg Communication</p>
            <p className="text-4xl font-black text-slate-700 mt-2">{dashboardData.average_communication} <span className="text-lg text-slate-400">/ 10</span></p>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl mb-8">
          <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2"><BarChart className="h-5 w-5"/> AI Summary</h3>
          <p className="text-indigo-900 leading-relaxed">{dashboardData.summary}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <button 
            onClick={() => setShowDetails(!showDetails)} 
            className="bg-white text-indigo-700 border border-indigo-200 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition flex items-center justify-center gap-2"
          >
            <FileText className="h-5 w-5"/>
            {showDetails ? 'Hide Detailed Breakdown' : 'View Detailed Breakdown'}
          </button>
          <button onClick={endInterview} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition">
            Start New Interview
          </button>
        </div>

        {/* Detailed Breakdown Section (Toggled) */}
        {showDetails && (
          <div className="space-y-6 border-t border-slate-200 pt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Question-by-Question Analysis</h3>
            
            {dashboardData.detailed_breakdown.map((item, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                
                {/* Question */}
                <h4 className="font-bold text-slate-800 text-lg mb-3">
                  <span className="text-indigo-600 mr-2">Q{index + 1}:</span> 
                  {item.question}
                </h4>
                
                {/* Candidate Answer */}
                <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Your Transcript</span>
                  <p className="text-slate-700">{item.answer || <span className="italic text-slate-400">No audio transcribed.</span>}</p>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-center">
                    <p className="text-xs text-indigo-600 font-bold uppercase">Tech Score</p>
                    <p className="text-xl font-black text-indigo-900 mt-1">{item.final_technical_score}/10</p>
                  </div>
                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-center">
                    <p className="text-xs text-indigo-600 font-bold uppercase">Comm Score</p>
                    <p className="text-xl font-black text-indigo-900 mt-1">{item.communication_score}/10</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2 md:col-span-2">
                    <p className="text-xs text-slate-500 font-bold uppercase">Expected Keywords</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.keywords_checked?.map((kw, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded shadow-sm">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Feedback */}
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">AI Feedback</span>
                  <p className="text-green-900 text-sm leading-relaxed">{item.feedback}</p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    );
  }

  // NORMAL INTERVIEW RENDER
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Header Configuration */}
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
             <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
               Target Job Role <span className="text-red-500">*</span>
             </label>
             <input 
               type="text" 
               placeholder="e.g. Full Stack Developer" 
               className="w-full mt-1 p-2.5 border text-slate-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
               value={role}
               onChange={(e) => setRole(e.target.value)}
             />
          </div>
{/* ALWAYS VISIBLE ACTION BAR */}
          <div className="flex items-center gap-3">
             
             {/* THE MUTE TOGGLE */}
             <button 
               onClick={toggleAudio}
               className={`p-2.5 rounded-lg border transition ${
                 isAudioEnabled 
                 ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm' 
                 : 'bg-slate-100 border-slate-200 text-slate-400'
               }`}
               title={isAudioEnabled ? "Mute AI Voice" : "Enable AI Voice"}
             >
               {isAudioEnabled ? <Volume2 className="h-5 w-5"/> : <VolumeX className="h-5 w-5"/>}
             </button>

             {/* PRE-INTERVIEW BUTTONS */}
             {!question && (
                <>
                  <button 
                    onClick={startInterview}
                    disabled={loading || !role}
                    className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5"/> : <Play className="h-5 w-5"/>}
                    Start
                  </button>
                </>
             )}

             {/* ACTIVE INTERVIEW BUTTON */}
             {question && (
                <button onClick={endInterview} className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-lg font-medium hover:bg-red-100 transition flex items-center gap-2 shadow-sm">
                  <XCircle className="h-5 w-5"/> End
                </button>
             )}
          </div>
          </div>
      </div>

      {/* Main Interaction Area */}
      <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto min-h-[400px]">
        {!question && !loading && (
          <div className="text-center text-slate-400 my-auto">
             <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-indigo-500" />
             </div>
             <h3 className="text-lg font-semibold text-slate-800">Ready to Interview?</h3>
             <p className="text-sm mt-2 max-w-xs mx-auto">Set your Target Role and click Start.</p>
          </div>
        )}

        {question && (
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl rounded-tl-none animate-in fade-in slide-in-from-left-2 relative">
            <span className="text-indigo-600 text-xs font-bold uppercase mb-2 block tracking-wide">
              AI Interviewer • Question {qNumber} of {totalQ}
            </span>
            <p className="text-slate-800 text-lg font-medium leading-relaxed">{question}</p>
          </div>
        )}

        {question && !feedback && (
           <div className="mt-auto animate-in fade-in slide-in-from-bottom-4">
             <textarea 
               className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none shadow-sm text-slate-700"
               rows="5"
               placeholder="Type your answer here or use the microphone..."
               value={answer}
               onChange={(e) => setAnswer(e.target.value)}
             />
             <div className="flex justify-between items-center mt-4">
               <button 
                 onClick={isRecording ? stopRecording : startRecording}
                 className={`flex items-center gap-2 text-sm font-medium transition px-4 py-2 rounded-lg border ${
                    isRecording ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                 }`}
               >
                 {isRecording ? <><StopCircle className="h-5 w-5"/> Stop</> : <><Mic className="h-5 w-5"/> Record Answer</>}
               </button>

               <button 
                 onClick={submitResponse}
                 disabled={loading || !answer}
                 className="bg-slate-900 text-white px-8 py-2.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50"
               >
                 {loading ? 'Evaluating...' : 'Submit Answer'} <Send className="h-4 w-4"/>
               </button>
             </div>
           </div>
        )}

{feedback && (
          <div className="bg-green-50 border border-green-100 p-6 rounded-2xl animate-in zoom-in-95 shadow-sm">
             <span className="text-green-700 text-xs font-bold uppercase mb-3 block tracking-wide">AI Feedback & Evaluation</span>
             <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{feedback}</p>
             
             {/* FIX: Use handleNextAction and dynamically check for dashboardData */}
             <button 
               onClick={handleNextAction} 
               className="mt-6 bg-white border border-green-200 text-green-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-100 transition flex items-center gap-2 shadow-sm"
             >
               {dashboardData ? 'View Results' : 'Next Question'} <ArrowRight className="h-4 w-4"/>
             </button>
          </div>
        )}
      </div>
    </div>
  );
}