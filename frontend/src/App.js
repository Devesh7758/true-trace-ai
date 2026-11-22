import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import UploadView from './components/Upload';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Results from './components/Results';
import About from './components/About';
import DevBadge from './components/DevBadge';

const HISTORY_KEY = 'trueTraceHistory';
const MAX_HISTORY = 100;

// One long page: these are the scroll sections, in order
const SECTIONS = ['Home', 'Forensic Upload', 'Dashboard', 'History', 'About'];
const sectionId = (name) => `section-${name.toLowerCase().replace(/\s+/g, '-')}`;

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
  const [activeSection, setActiveSection] = useState('Home');
  const [analysisData, setAnalysisData] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const mainRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
    } catch {
      // storage full or blocked (private mode) — history still works for this visit
    }
  }, [history]);

  // Scroll-spy: highlight whichever section is in the middle band of the viewport
  useEffect(() => {
    const root = mainRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveSection(visible[0].target.dataset.section);
      },
      { root, rootMargin: '-35% 0px -60% 0px', threshold: 0 }
    );
    SECTIONS.forEach((name) => {
      const el = document.getElementById(sectionId(name));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Sidebar / buttons: smooth-scroll to a section ("Results" lives in the upload section)
  const goTo = useCallback((name) => {
    const target = name === 'Results' ? 'Forensic Upload' : name;
    document.getElementById(sectionId(target))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

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
    goTo('Forensic Upload');
  };

  const startNewScan = () => {
    setAnalysisData(null);
    goTo('Forensic Upload');
  };

  const sectionContent = {
    Home: <Home onUploadClick={() => goTo('Forensic Upload')} />,
    'Forensic Upload': analysisData ? (
      <Results data={analysisData} onReset={startNewScan} />
    ) : (
      <UploadView onAnalysisComplete={handleAnalysisComplete} />
    ),
    Dashboard: <Dashboard history={history} setView={goTo} setAnalysisData={setAnalysisData} />,
    History: <History history={history} onUploadClick={startNewScan} />,
    About: <About />,
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden selection:bg-blue-100">
      <Sidebar currentView={activeSection} setCurrentView={goTo} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-50">
          <h2
            key={activeSection}
            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-in fade-in duration-300"
          >
            {activeSection}
          </h2>

          <DevBadge size="sm" />
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto bg-[#FBFCFD] scroll-smooth">
          <div className="max-w-[1400px] mx-auto px-8">
            {SECTIONS.map((name) => (
              <section
                key={name}
                id={sectionId(name)}
                data-section={name}
                className="min-h-[calc(100vh-4rem)] py-10 border-b border-slate-100 last:border-b-0"
              >
                {sectionContent[name]}
              </section>
            ))}

            <footer className="py-10 flex justify-center">
              <DevBadge size="md" />
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
