import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import UploadView from './components/Upload';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Results from './components/Results';
import About from './components/About';

import { Bell, Search } from 'lucide-react';

const HISTORY_KEY = 'trueTraceHistory';
const MAX_HISTORY = 100;

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Map the FastAPI response's details onto the shape the Results/History views use
const normalizeDetails = (d = {}) => ({
  duration: d.duration || '—',
  resolution: d.resolution || '224x224',
  frames_analyzed: Number(d.frames_analyzed ?? d.frames) || 0,
  inference_speed: d.inference_speed || d.time || '—',
});

// History is kept in this browser only (no account or database needed)
const loadHistory = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

function App() {
  const [currentView, setCurrentView] = useState('Home');
  const [analysisData, setAnalysisData] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
    } catch {
      // storage full or blocked (private mode) — history still works for this visit
    }
  }, [history]);

  const handleAnalysisComplete = (data) => {
    const details = normalizeDetails(data.details);

    // Images stay out of saved history to keep localStorage small
    const record = {
      id: Date.now(),
      filename: data.filename,
      date: formatDate(Date.now()),
      prediction: data.prediction,
      confidence: data.confidence,
      details,
    };

    setHistory((prev) => [record, ...prev].slice(0, MAX_HISTORY));
    setAnalysisData({ ...data, details });
    setCurrentView('Results');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'Forensic Upload':
        return <UploadView onAnalysisComplete={handleAnalysisComplete} />;
      case 'Dashboard':
        return <Dashboard history={history} setView={setCurrentView} setAnalysisData={setAnalysisData} />;
      case 'History':
        return <History history={history} onUploadClick={() => setCurrentView('Forensic Upload')} />;
      case 'Results':
        return <Results data={analysisData} onReset={() => setCurrentView('Forensic Upload')} />;
      case 'About':
        return <About />;
      case 'Home':
      default:
        return <Home onUploadClick={() => setCurrentView('Forensic Upload')} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden selection:bg-blue-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-50">
          <div className="flex items-center gap-8 flex-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{currentView}</h2>

            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Search forensic archives..."
                className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {history.length > 0 ? '1' : '0'}
              </span>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-100 pl-5">
              <div className="flex-col text-right hidden sm:flex">
                <span className="text-sm font-bold text-slate-700 leading-none">Team Pixel</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mt-1">
                  Forensic Console
                </span>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-100">
                P
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#FBFCFD]">
          <div className="max-w-[1400px] mx-auto h-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default App;
