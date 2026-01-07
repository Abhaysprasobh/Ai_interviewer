// src/components/InterviewBot.jsx
"use client";
import { useState, useRef } from 'react'; // Added useRef
import GlobalApi from '../_utils/GlobalApi';
import { Mic, Send, Loader2, Play, StopCircle } from 'lucide-react'; // Added StopCircle

export default function InterviewBot() {
  const [config, setConfig] = useState({ role: '', difficulty: 'medium' });
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // --- NEW: Speech State ---
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  // 1. Start Interview
  const generateQuestion = async () => {
    if (!config.role) return alert("Please enter a job role");
    setLoading(true);
    setFeedback(null);
    setAnswer('');
    
    try {
      const resp = await GlobalApi.startInterview(config);
      setQuestion(resp.data.question);
    } catch (error) {
      console.error(error);
      alert("Error generating question");
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
        answer: answer
      });
      setFeedback(resp.data.feedback);
    } catch (error) {
      alert("Error evaluating answer");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Handle Voice Recording ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // Browser default
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm'); // Backend converts this!

        setLoading(true); // Show loader while transcribing
        try {
          const resp = await GlobalApi.transcribeAudio(formData);
          // Append transcribed text to existing answer
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
      alert("Please allow microphone access to use this feature.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Configuration */}
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Role</label>
            <input 
              type="text" 
              placeholder="e.g. Backend Developer" 
              className="w-full mt-1 p-2 border rounded-md"
              value={config.role}
              onChange={(e) => setConfig({...config, role: e.target.value})}
            />
          </div>
          <div className="w-full md:w-48">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Difficulty</label>
             <select 
               className="w-full mt-1 p-2 border rounded-md"
               value={config.difficulty}
               onChange={(e) => setConfig({...config, difficulty: e.target.value})}
             >
               <option value="easy">Easy</option>
               <option value="medium">Medium</option>
               <option value="hard">Hard</option>
             </select>
          </div>
          <button 
            onClick={generateQuestion}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-indigo-700 transition flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4"/> : <Play className="h-4 w-4"/>}
            Start
          </button>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="p-6 min-h-[400px] flex flex-col gap-6">
        
        {/* Question Bubble */}
        {question && (
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl rounded-tl-none animate-in fade-in slide-in-from-bottom-4">
            <span className="text-indigo-600 text-xs font-bold uppercase mb-1 block">AI Interviewer</span>
            <p className="text-slate-800 text-lg font-medium">{question}</p>
          </div>
        )}

        {/* Answer Input Area */}
        {question && !feedback && (
           <div className="mt-auto">
             <textarea 
               className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
               rows="4"
               placeholder="Type your answer here..."
               value={answer}
               onChange={(e) => setAnswer(e.target.value)}
             />
             <div className="flex justify-between items-center mt-3">
               
               {/* --- UPDATED RECORD BUTTON --- */}
               <button 
                 onClick={isRecording ? stopRecording : startRecording}
                 className={`flex items-center gap-2 text-sm font-medium transition ${
                    isRecording ? 'text-red-600 animate-pulse' : 'text-slate-500 hover:text-indigo-600'
                 }`}
               >
                 {isRecording ? (
                    <><StopCircle className="h-5 w-5"/> Stop Recording</>
                 ) : (
                    <><Mic className="h-5 w-5"/> Record Voice (Beta)</>
                 )}
               </button>

               <button 
                 onClick={submitResponse}
                 disabled={loading || !answer}
                 className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50"
               >
                 {loading ? 'Analyzing...' : 'Submit Answer'} <Send className="h-4 w-4"/>
               </button>
             </div>
           </div>
        )}

        {/* Feedback Display */}
        {feedback && (
          <div className="bg-green-50 border border-green-100 p-5 rounded-xl animate-in zoom-in-95">
             <span className="text-green-700 text-xs font-bold uppercase mb-2 block">Evaluation & Feedback</span>
             <p className="text-slate-700 leading-relaxed">{feedback}</p>
             <button 
               onClick={generateQuestion} 
               className="mt-4 text-indigo-600 font-semibold hover:underline text-sm"
             >
               Request Next Question →
             </button>
          </div>
        )}

        {!question && !loading && (
          <div className="text-center text-slate-400 mt-20">
            Configure the role above and click Start to begin.
          </div>
        )}
      </div>
    </div>
  );
}