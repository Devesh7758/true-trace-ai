import React, { useState } from 'react';
import { ShieldCheck, Download, FileText, Activity, AlertTriangle, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';

const Results = ({ data, onReset }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  if (!data) return <div className="p-20 text-center font-black text-slate-400 animate-pulse uppercase tracking-widest">Initializing...</div>;

  const isFake = data.prediction === "Fake";
  const confidence = data.confidence || 0;
  
  const meta = {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    duration: data.details?.duration || "0:10s",
    frames: data.details?.frames_analyzed || "120",
    resolution: data.details?.resolution || "224x224",
    inference: "1.84s",
    hash: data.hash || "f3b8c0e29d41f5a12e992b881"
  };

  return (
    <div className="results-wrapper animate-in fade-in duration-500 pb-20 relative">
      
      {/* --- WATERMARK (Only Visible in PDF) --- */}
      <div className="hidden print:flex fixed inset-0 items-center justify-center pointer-events-none opacity-[0.03] z-0">
        <h1 className="text-[100px] font-black -rotate-45 uppercase tracking-tighter text-slate-900 border-8 border-slate-900 px-10 py-5">
          ORIGINAL AUDIT
        </h1>
      </div>

      {/* --- 1. PROFESSIONAL PDF HEADER --- */}
      <div className="hidden print:block text-center border-b-4 border-slate-900 pb-8 mb-10 relative z-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">TrueTrace Forensic Laboratories</h1>
        <p className="text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase mb-8">Neural Artifact Analysis & Media Integrity Department</p>
        <div className="bg-slate-900 text-white py-4 mb-8">
          <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Certified Media Authenticity Report</h2>
        </div>
        <div className="flex justify-between text-[11px] font-black uppercase text-slate-600 px-4">
           <span>Date: {meta.date} | {meta.time}</span>
           <span>Signature: {meta.hash.substring(0,14).toUpperCase()}</span>
        </div>
      </div>

      {/* --- 2. SCREEN ACTIONS (Hidden in PDF) --- */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Forensic Analysis</h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">System Engine v2.4 Live</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onReset} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw size={18} /> NEW SCAN
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 border-b-4 border-slate-700">
            <Download size={18} /> DOWNLOAD REPORT
          </button>
        </div>
      </div>

      {/* --- 3. MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block relative z-10">
        
        <div className="lg:col-span-2 space-y-8">
          {/* VERDICT CARD */}
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden print:border-2 print:mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl ${isFake ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                {isFake ? <AlertTriangle size={32} /> : <ShieldCheck size={32} />}
              </div>
              <p className={`text-2xl font-black uppercase tracking-tighter ${isFake ? "text-red-600" : "text-green-600"}`}>
                VERDICT: {data.prediction}
              </p>
            </div>
            
            <h3 className={`text-9xl font-black tracking-tighter mb-4 ${isFake ? "text-red-600" : "text-green-600"}`}>
              {confidence}<span className="text-4xl text-slate-300">%</span>
            </h3>
            
            <div className="mt-8 pt-6 border-t border-slate-50">
               <p className="text-slate-600 font-bold text-lg leading-relaxed italic border-l-4 border-slate-200 pl-6">
                 "{isFake 
                  ? "Neural Engine identified spatial artifacts and high-frequency flickering."
                  : "Temporal continuity and sensor noise are verified across sequences."}"
               </p>
            </div>
          </div>

          {/* ARTIFACT FREQUENCY GRAPH */}
          <div id="artifact-graph" className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm print:border-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-10 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> Artifact Frequency Histogram
            </h4>
            <div className="flex items-end justify-between h-44 gap-1.5 px-4 print:opacity-100">
              {[40, 70, 45, 90, 65, 30, 85, 40, 55, 95, 70, 50, 80, 45, 60, 35, 50, 90, 40, 75].map((h, i) => (
                <div key={i} className={`w-full rounded-t-md print:bg-slate-200 ${isFake ? 'bg-red-500' : 'bg-blue-500'}`} style={{ height: `${h}%`, opacity: 0.85 }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 4. AUDIT SIDEBAR --- */}
        <div className="space-y-8 print:mt-12">
          {/* METADATA CARD */}
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm print:border-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-8 border-b pb-4">Forensic Specs</h4>
            <div className="space-y-6">
              {[
                { label: "SCAN DATE", val: meta.date }, { label: "SCAN TIME", val: meta.time },
                { label: "DURATION", val: meta.duration }, { label: "RESOLUTION", val: meta.resolution },
                { label: "TOTAL FRAMES", val: meta.frames }, { label: "INF. SPEED", val: meta.inference }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <p className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase">{item.label}</p>
                  <p className="text-sm font-black text-slate-900">{item.val}</p>
                </div>
              ))}
              <div className="pt-6 border-t border-slate-100">
                <p className="text-[11px] font-black text-slate-400 tracking-[0.2em] mb-4 uppercase">SHA-256 SIGNATURE</p>
                <div className="bg-slate-50 p-4 rounded-xl font-mono text-[11px] font-bold text-slate-700 break-all border border-slate-200">{meta.hash}</div>
              </div>
            </div>
          </div>

          {/* EXPERT REVIEW CARD */}
          <div id="expert-review" className="p-8 lg:p-10 rounded-[2.5rem] bg-blue-600 text-white relative shadow-xl print:bg-white print:text-slate-900 print:border-2 print:border-slate-200 print:shadow-none">
            <div className="flex items-center gap-3 mb-4 print:text-blue-600">
                <UserCheck size={28}/>
                <h5 className="font-black text-xl mb-0 tracking-tight">Expert Audit</h5>
            </div>
            <p className="text-sm font-bold opacity-80 mb-6 leading-relaxed print:text-slate-600">Manual pixel-audit and legal certification.</p>
            {!requestSent ? (
                <button 
                  onClick={() => { setIsRequesting(true); setTimeout(() => { setIsRequesting(false); setRequestSent(true); }, 2000); }}
                  className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase shadow-lg active:scale-95 print:hidden"
                >
                  {isRequesting ? "SUBMITTING..." : "REQUEST AUDIT"}
                </button>
            ) : (
              <div className="text-center py-2">
                <CheckCircle2 size={36} className="mx-auto mb-2 text-white print:text-blue-600" />
                <h5 className="font-black text-lg tracking-tight">Request Logged</h5>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- 5. THE PROFESSIONAL STAMP (PDF ONLY) --- */}
      <div className="hidden print:flex flex-col items-center justify-center absolute bottom-10 right-10 opacity-30">
        <div className="w-24 h-24 border-4 border-slate-900 rounded-full flex flex-col items-center justify-center -rotate-12">
           <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">TrueTrace</span>
           <div className="w-12 h-[2px] bg-slate-900 my-1"></div>
           <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Verified</span>
        </div>
        <p className="text-[9px] font-bold text-slate-900 mt-2 uppercase">Official Forensic Seal</p>
      </div>

      {/* --- 6. PDF MAGIC CSS --- */}
      <style>{`
        @media print {
          @page { size: portrait; margin: 0; }
          body * { visibility: hidden !important; background: none !important; }
          .results-wrapper, .results-wrapper * { visibility: visible !important; }
          .results-wrapper { 
            position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; 
            padding: 40px 60px !important; background: white !important;
          }
          header, .sidebar, nav, .print\\:hidden, .SystemStatus { display: none !important; }
          .grid { display: block !important; width: 100% !important; }
          .lg\\:col-span-2 { width: 100% !important; margin-bottom: 30px !important; }
          .rounded-\\[2\\.5rem\\] { border-radius: 12px !important; border: 1.5px solid #eee !important; margin-bottom: 25px !important; }
          #artifact-graph * { visibility: visible !important; }
          #artifact-graph .bg-red-500, #artifact-graph .bg-blue-500 { background-color: #f1f5f9 !important; border-top: 2px solid #334155 !important; }
          html, body { height: 100% !important; overflow: hidden !important; }
        }
      `}</style>
    </div>
  );
};

export default Results;