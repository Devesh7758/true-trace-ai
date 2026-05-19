import React, { useState, useMemo } from 'react';
import { Search, Upload, CheckCircle2, XCircle, AlertCircle, BarChart3, Play, MoreHorizontal } from "lucide-react";

const History = ({ history, onUploadClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("all");

  const filteredItems = useMemo(() => {
    let items = [...history];
    if (searchQuery) {
      items = items.filter((item) => item.filename.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (resultFilter !== "all") {
      items = items.filter((item) => item.prediction === resultFilter);
    }
    return items;
  }, [history, searchQuery, resultFilter]);

  const stats = useMemo(() => ({
    total: history.length,
    real: history.filter(h => h.prediction === "Authentic").length,
    fake: history.filter(h => h.prediction === "Fake").length,
    suspicious: history.filter(h => h.confidence < 60 && h.confidence > 40).length
  }), [history]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Analysis History</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage forensic reports</p>
        </div>
        <button onClick={onUploadClick} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-2 hover:bg-blue-700">
          <Upload size={18} /> Upload New
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Videos", val: stats.total, icon: <BarChart3 size={20}/>, color: "blue" },
          { label: "Authentic", val: stats.real, icon: <CheckCircle2 size={20}/>, color: "emerald" },
          { label: "Fakes Detected", val: stats.fake, icon: <XCircle size={20}/>, color: "red" },
          { label: "Need Review", val: stats.suspicious, icon: <AlertCircle size={20}/>, color: "amber" }
        ].map((s, i) => (
          <div key={i} className="pro-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.val}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="pro-card p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none"
          />
        </div>
        <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value)} className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium text-slate-600 outline-none">
          <option value="all">All Results</option>
          <option value="Authentic">Authentic</option>
          <option value="Fake">Fake</option>
        </select>
      </div>

      <div className="pro-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Video Source</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Score</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all"><Play size={14} fill="currentColor" /></div>
                  <span className="text-sm font-bold text-slate-700 truncate max-w-[250px]">{item.filename}</span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400">{item.date}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.prediction === 'Fake' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {item.prediction}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-black text-right ${item.prediction === 'Fake' ? 'text-red-500' : 'text-emerald-500'}`}>{item.confidence}%</td>
                <td className="px-6 py-4 text-right text-slate-200"><MoreHorizontal size={18} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;