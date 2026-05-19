import React, { useState } from 'react';
import { Bell, Search, Settings, User, LogOut, ChevronDown, Activity } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import UploadView from './components/Upload';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Results from './components/Results';
import About from './components/About';
import Login from './components/Login'; 
function App() {
  // 1. Navigation & Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New State
  const [currentView, setCurrentView] = useState('Home');
  const [analysisData, setAnalysisData] = useState(null);
  
  // 2. Profile Dropdown State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 3. Real-Time History State
  const [history, setHistory] = useState([]);

  // 4. Handle Incoming Analysis from Backend
  const handleAnalysisComplete = (data) => {
    const newRecord = {
      id: Date.now(),
      filename: data.filename,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      prediction: data.prediction,
      confidence: data.confidence,
      details: data.details || { resolution: '1080p', frames_analyzed: 120 }
    };

    setHistory(prev => [newRecord, ...prev]);
    setAnalysisData(data);
    setCurrentView('Results');
  };

  // 5. Navigation Switcher
  const renderContent = () => {
    switch (currentView) {
      case 'Home': 
        return <Home onUploadClick={() => setCurrentView('Forensic Upload')} />;
      case 'Forensic Upload': 
        return <UploadView onAnalysisComplete={handleAnalysisComplete} />;
      case 'Dashboard': 
        return <Dashboard history={history} setView={setCurrentView} />;
      case 'History': 
        return <History history={history} onUploadClick={() => setCurrentView('Forensic Upload')} />;
      case 'Results': 
        return <Results data={analysisData} onReset={() => setCurrentView('Forensic Upload')} />;
      case 'About': 
        return <About />;
      default: 
        return <Home onUploadClick={() => setCurrentView('Forensic Upload')} />;
    }
  };

  // 6. IF NOT LOGGED IN, SHOW LOGIN PAGE
  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // 7. MAIN APP RENDER (Exactly your code)
  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden selection:bg-blue-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-50">
          <div className="flex items-center gap-8 flex-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{currentView}</h2>
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" placeholder="Search forensic archives..." className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {history.length > 0 ? '1' : '0'}
              </span>
            </div>
            
            <div className="relative border-l border-slate-100 pl-5">
              <div className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-slate-50 rounded-xl transition-all" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-sm font-bold text-slate-700 leading-none group-hover:text-blue-600 transition-colors">Team Pixel</span>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mt-1">Lead Developer</span>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-100">P</div>
                <ChevronDown size={14} className={`text-slate-300 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-50 mb-2">
                    <p className="text-sm font-bold text-slate-800 leading-none">Devesh Dwivedi</p>
                    <p className="text-[11px] text-slate-400 mt-1.5 truncate">devesh.dwivedi@sgtuniversity.ac.in</p>
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                    <User size={16} className="text-slate-400" /> View Profile
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                    <Activity size={16} className="text-slate-400" /> Usage Statistics
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                    <Settings size={16} className="text-slate-400" /> Settings
                  </button>
                  <div className="h-px bg-slate-100 my-2 mx-2"></div>
                  {/* Updated Sign Out button */}
                  <button 
                    onClick={() => setIsLoggedIn(false)} 
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#FBFCFD]">
          <div className="max-w-[1400px] mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
      )}
    </div>
  );
}

export default App;