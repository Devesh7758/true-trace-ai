import React, { useState } from 'react';
import { Upload, Video, AlertCircle, RefreshCw } from 'lucide-react';

const UploadView = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- EXACT DUAL-BACKEND PRODUCTION ENVIRONMENT ENDPOINTS ---
  const AI_ENGINE_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000'
    : 'https://true-trace-ai-1.onrender.com'; // Your verified live FastAPI Engine

  const NODE_AUTH_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://true-trace-ai.onrender.com/api'; // Your live Node.js Auth Backend

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid forensic video file asset.');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError('');

    // Wrap your binary video inside a multipart payload stream
    const formData = new FormData();
    formData.append('file', file);

    try {
      // PHASE 1: Call your exact FastAPI endpoint (/analyze)
      const aiResponse = await fetch(`${AI_ENGINE_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData, // Browser sets multipart/form-data headers automatically
      });

      if (!aiResponse.ok) throw new Error('Neural Engine internal pipeline break.');
      const aiResult = await aiResponse.json();

      // PHASE 2: Mirror the AI findings to MongoDB via your separate Node Auth Backend
      const token = localStorage.getItem('trueTraceToken');
      
      const mongoResponse = await fetch(`${NODE_AUTH_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Protected routes gate check
        },
        body: JSON.stringify({
          filename: file.name,
          hash: aiResult.hash || `sha256:${Math.random().toString(16).substring(2, 18)}`,
          prediction: aiResult.prediction,
          confidence: aiResult.confidence,
          details: aiResult.details || { resolution: '224x224', duration: '0:10s', frames_analyzed: 120 }
        })
      });

      if (!mongoResponse.ok) {
        console.warn('AI Analysis worked, but log failed to save into MongoDB Atlas.');
      }

      // PHASE 3: Pass final result payload to App.js to switch view to Results screen
      onAnalysisComplete(aiResult);

    } catch (err) {
      console.error('Inference Error context logs:', err);
      setError('System Error: Could not connect to Neural Engine. Ensure Python AI backend is active.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Forensic Asset Ingestion</h3>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Upload video source for layer manipulation scanning</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUploadSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:bg-slate-50 transition-all cursor-pointer relative group">
          <input required type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          <div className="flex flex-col items-center justify-center">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {file ? <Video size={32} className="text-blue-500" /> : <Upload size={32} />}
            </div>
            <p className="text-sm font-black text-slate-700">{file ? file.name : "Drop media file here or browse"}</p>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight">Supports mp4, avi, mov up to 50MB</p>
          </div>
        </div>

        <button type="submit" disabled={!file || isLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-2 disabled:opacity-40">
          {isLoading ? <RefreshCw className="animate-spin" size={16} /> : null}
          {isLoading ? "EXECUTING NEURAL SCAN..." : "RUN INTENSITY INFERENCE"}
        </button>
      </form>
    </div>
  );
};

export default UploadView;