// src/components/InterviewBot.jsx
"use client";
import { useState, useRef, useEffect } from 'react';
import GlobalApi from '../_utils/GlobalApi';
import { Mic, Send, Loader2, Play, StopCircle, Sparkles, ArrowRight, FileText } from 'lucide-react';

export default function InterviewBot({ resumeData }) {
  // Removed 'difficulty' from state
  const [role, setRole] = useState(''); 
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [nextQ, setNextQ] = useState(null);

  // Speech State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  // Skills State (Derived from Resume)
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (resumeData && resumeData.skills) {
      setSkills(resumeData.skills);
    }
  }, [resumeData]);

  // 1. Start Interview
  const startInterview = async () => {
    // Validation: Role is now mandatory
    if (!role) {
      return alert("Please enter a target Job Role (e.g. 'Product Manager') to start.");
    }

    setLoading(true);
    setFeedback(null);
    setAnswer('');
    setQuestion(null);
    
    try {
      // --- NEW PAYLOAD STRUCTURE ---
      // We send the manual Role + Parsed Resume Data
      const dataToSend = {
        role: role, 
        skills: skills,
        education: resumeData?.education || "",
        experience: resumeData?.experience || ""
      };

      console.log("📤 Sending Context:", dataToSend); // Debug log

      const resp = await GlobalApi.startInterview(dataToSend);
      setQuestion(resp.data.question);
      setSessionId(resp.data.session_id); 

    } catch (error) {
      console.error(error);
      alert("Error starting interview");
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
      
      if (resp.data.next_question) {
        setNextQ(resp.data.next_question);
      }

    } catch (error) {
      console.error(error);
      alert("Error evaluating answer");
    } finally {
      setLoading(false);
    }
  };

  // 3. Load Next Question
  const loadNextQuestion = () => {
    if (nextQ) {
      setQuestion(nextQ);     
      setAnswer('');          
      setFeedback(null);      
      setNextQ(null);         
    } else {
      startInterview();
    }
  };

  // --- Voice Recording Logic (Unchanged) ---
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
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        setLoading(true);
        try {
          const resp = await GlobalApi.transcribeAudio(formData);
          setAnswer(prev => prev + (prev ? " " : "") + resp.data.text);
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
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Header Configuration */}
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          
          {/* Target Role Input (Always Visible) */}
          <div className="flex-1 w-full">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
               Target Job Role <span className="text-red-500">*</span>
             </label>
             <input 
               type="text" 
               placeholder="e.g. Full Stack Developer" 
               className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
               value={role}
               onChange={(e) => setRole(e.target.value)}
             />
          </div>

          {/* Context Badge (Visual Indicator) */}
          {skills.length > 0 && (
             <div className="hidden md:flex flex-col justify-end pb-1">
                <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 font-medium">
                   <FileText className="h-4 w-4" />
                   Using Resume Context ({skills.length} skills)
                </div>
             </div>
          )}

          {/* Start Button */}
          {!question && (
            <button 
              onClick={startInterview}
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5"/> : <Play className="h-5 w-5"/>}
              Start Interview
            </button>
          )}
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
             <p className="text-sm mt-2 max-w-xs mx-auto">
               Set your <strong>Target Role</strong> above and click Start. We'll use your resume to tailor the questions.
             </p>
          </div>
        )}

        {question && (
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl rounded-tl-none animate-in fade-in slide-in-from-left-2">
            <span className="text-indigo-600 text-xs font-bold uppercase mb-2 block tracking-wide">AI Interviewer</span>
            <p className="text-slate-800 text-lg font-medium leading-relaxed">{question}</p>
          </div>
        )}

        {question && !feedback && (
           <div className="mt-auto animate-in fade-in slide-in-from-bottom-4">
             <textarea 
               className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none shadow-sm text-slate-700"
               rows="5"
               placeholder="Type your answer here..."
               value={answer}
               onChange={(e) => setAnswer(e.target.value)}
             />
             <div className="flex justify-between items-center mt-4">
               
               <button 
                 onClick={isRecording ? stopRecording : startRecording}
                 className={`flex items-center gap-2 text-sm font-medium transition px-4 py-2 rounded-lg border ${
                    isRecording 
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600'
                 }`}
               >
                 {isRecording ? (
                    <><StopCircle className="h-5 w-5"/> Stop Recording</>
                 ) : (
                    <><Mic className="h-5 w-5"/> Record Answer</>
                 )}
               </button>

               <button 
                 onClick={submitResponse}
                 disabled={loading || !answer}
                 className="bg-slate-900 text-white px-8 py-2.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50 shadow-md"
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
             
             <button 
               onClick={loadNextQuestion} 
               className="mt-6 bg-white border border-green-200 text-green-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-100 transition flex items-center gap-2 shadow-sm"
             >
               Next Question <ArrowRight className="h-4 w-4"/>
             </button>
          </div>
        )}
      </div>
    </div>
  );
}