import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import UploadView from './components/Upload';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Results from './components/Results';
import About from './components/About';
import Login from './components/Login';
import { session, reportService } from './api/authService';

import { Bell, Search, LogIn, LogOut, ChevronDown } from 'lucide-react';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Map the FastAPI response's details onto the shape the Report model / Results view use
const normalizeDetails = (d = {}) => ({
  duration: d.duration || '—',
  resolution: d.resolution || '224x224',
  frames_analyzed: Number(d.frames_analyzed ?? d.frames) || 0,
  inference_speed: d.inference_speed || d.time || '—',
});

// Turn a saved MongoDB report into the same shape as a local history record
const fromServerReport = (r) => ({
  id: r._id,
  filename: r.filename,
  date: formatDate(r.createdAt),
  prediction: r.prediction,
  confidence: r.confidence,
  hash: r.hash,
  details: normalizeDetails(r.details),
});

function App() {
  // Direct access by default; logging in is optional and only enables cloud history.
  const [auth, setAuth] = useState(() => session.get()); // { token, user } | null
  const [showLogin, setShowLogin] = useState(false);

  const [currentView, setCurrentView] = useState('Home');
  const [analysisData, setAnalysisData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [notice, setNotice] = useState('');

  const handleLogout = () => {
    session.clear();
    setAuth(null);
    setHistory([]);
    setIsProfileOpen(false);
  };

  // Load saved reports when logged in
  useEffect(() => {
    if (!auth) return;
    let cancelled = false;
    reportService
      .history(auth.token)
      .then((reports) => {
        if (!cancelled) setHistory(reports.map(fromServerReport));
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) {
          session.clear(); // expired / invalid token
          setAuth(null);
        } else {
          console.warn('Could not load saved history:', err.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [auth]);

  const handleLoginSuccess = (token, user) => {
    session.save(token, user);
    setAuth({ token, user });
    setShowLogin(false);
  };

  const handleAnalysisComplete = (data) => {
    const details = normalizeDetails(data.details);
    const result = { ...data, details };

    const record = {
      id: Date.now(),
      filename: data.filename,
      date: formatDate(Date.now()),
      prediction: data.prediction,
      confidence: data.confidence,
      details,
    };

    setHistory((prev) => [record, ...prev]);
    setAnalysisData(result);
    setCurrentView('Results');

    // Optional cloud save — never blocks or breaks the result screen
    if (auth) {
      reportService
        .save(auth.token, {
          filename: data.filename,
          hash: data.hash || `local:${record.id}`,
          prediction: data.prediction,
          confidence: data.confidence,
          details,
        })
        .catch((err) => {
          console.warn('Report not saved to cloud:', err.message);
          setNotice('Result shown, but it could not be saved to your account.');
          setTimeout(() => setNotice(''), 6000);
        });
    }
  };

  if (showLogin) {
    return <Login onLoginSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />;
  }

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

  const displayName = auth?.user?.name || 'Guest';
  const initial = displayName.charAt(0).toUpperCase();

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

            {auth ? (
              <div className="relative border-l border-slate-100 pl-5">
                <div
                  className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-slate-50 rounded-xl transition-all"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="flex-col text-right hidden sm:flex">
                    <span className="text-sm font-bold text-slate-700 leading-none group-hover:text-blue-600 transition-colors">
                      {displayName}
                    </span>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mt-1">
                      {auth.user.role || 'Analyst'}
                    </span>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-100">
                    {initial}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-300 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-2 z-[100]">
                    <div className="p-4 border-b border-slate-50 mb-2">
                      <p className="text-sm font-bold text-slate-800 leading-none">{displayName}</p>
                      <p className="text-[11px] text-slate-400 mt-1.5 truncate">{auth.user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="border-l border-slate-100 pl-5 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <LogIn size={16} />
                Sign in
              </button>
            )}
          </div>
        </header>

        {notice && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-700 text-xs font-bold px-8 py-2">{notice}</div>
        )}

        <main className="flex-1 overflow-y-auto p-8 bg-[#FBFCFD]">
          <div className="max-w-[1400px] mx-auto h-full">{renderContent()}</div>
        </main>
      </div>

      {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}
    </div>
  );
}

export default App;
