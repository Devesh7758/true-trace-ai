import React, { useEffect, useState } from 'react';
import { Upload, Video, AlertCircle, RefreshCw } from 'lucide-react';
import { aiService } from '../api/aiService';

const MAX_SIZE_MB = 50;
const VIDEO_EXT = /\.(mp4|mov|avi|mkv|webm|m4v)$/i;

const UploadView = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slowHint, setSlowHint] = useState(false);
  const [error, setError] = useState('');

  // Start waking the Render AI service as soon as this screen opens
  useEffect(() => {
    aiService.health();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const isVideo = selected.type.startsWith('video/') || VIDEO_EXT.test(selected.name);
    if (!isVideo) {
      setFile(null);
      setError('Please select a valid video file (mp4, mov, avi, mkv, webm).');
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setFile(null);
      setError(`File is larger than ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(selected);
    setError('');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setSlowHint(false);
    setError('');
    const hintTimer = setTimeout(() => setSlowHint(true), 8000);

    try {
      const result = await aiService.analyze(file);
      onAnalysisComplete(result); // App.js handles history + optional MongoDB save
    } catch (err) {
      console.error('Inference error:', err);
      setError(`Analysis failed: ${err.message}`);
    } finally {
      clearTimeout(hintTimer);
      setIsLoading(false);
      setSlowHint(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-12 bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in duration-300">
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
        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 sm:p-12 text-center hover:bg-slate-50 transition-all cursor-pointer relative group">
          <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          <div className="flex flex-col items-center justify-center">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {file ? <Video size={32} className="text-blue-500" /> : <Upload size={32} />}
            </div>
            <p className="text-sm font-black text-slate-700">{file ? file.name : 'Drop media file here or browse'}</p>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight">Supports mp4, avi, mov up to {MAX_SIZE_MB}MB</p>
          </div>
        </div>

        <button type="submit" disabled={!file || isLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-2 disabled:opacity-40">
          {isLoading ? <RefreshCw className="animate-spin" size={16} /> : null}
          {isLoading ? 'EXECUTING NEURAL SCAN...' : 'RUN INTENSITY INFERENCE'}
        </button>

        {slowHint && (
          <p className="text-center text-xs font-bold text-slate-400">
            Waking up the AI engine — the first scan after idle can take up to a minute.
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadView;
